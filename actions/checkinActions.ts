"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const locationCheck = async (lat: number, lng: number) => {
  try {
    const shopLat = 11.479566;
    const shopLng = 104.946117;
    const allowedDistance = 100;

    const distance = getDistanceFromLatLonInKm(lat, lng, shopLat, shopLng);

    if (distance <= allowedDistance) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking in:", error);
  }
};

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function parseTimeString(timeString: string): Date {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function minutesDifference(date1: Date, date2: Date): number {
  const timeDiff = date2.getTime() - date1.getTime();
  return Math.round(timeDiff / 60000);
}

async function createCheckoutRecord(employeeId: string, lastCheckInTime: Date) {
  const checkoutTime = new Date(lastCheckInTime);
  checkoutTime.setHours(23, 59, 59, 999); // Set to end of the day

  await db.attendance.create({
    data: {
      type: "check-out",
      employee: { connect: { id: employeeId } },
      timestamp: checkoutTime,
      reason: "Auto-generated checkout",
      status: "auto",
      minutesDifference: 0,
    },
  });
}

export const pinCheck = async (data: any) => {
  const { pin, reason } = data;
  try {
    const employee = await db.employee.findFirst({
      where: { password: pin },
    });

    if (!employee) {
      console.log("No employee found with PIN:", pin);
      return;
    }

    const lastRecord = await db.attendance.findFirst({
      where: { employee_id: employee.id },
      orderBy: { timestamp: "desc" },
    });

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 7);

    let type: string = "check-in";

    if (lastRecord) {
      const lastRecordDate = new Date(lastRecord.timestamp);
      const isNewDay =
        lastRecordDate.getDate() !== currentTime.getDate() ||
        lastRecordDate.getMonth() !== currentTime.getMonth() ||
        lastRecordDate.getFullYear() !== currentTime.getFullYear();

      if (isNewDay && lastRecord.type === "check-in") {
        // Create a checkout record for the previous day
        await createCheckoutRecord(employee.id, lastRecord.timestamp);
      } else {
        type = lastRecord.type === "check-in" ? "check-out" : "check-in";
      }
    }

    const shift = await db.shift.findFirst({
      where: { id: employee.shift },
    });

    if (!shift) {
      console.log("No shift found for employee:", employee.id);
      return;
    }

    // Create new Date objects with current date but time from shift
    const today = new Date();
    today.setHours(today.getHours() + 7);

    let shiftStart = new Date(today);
    shiftStart.setHours(
      shift.start_time.getHours(),
      shift.start_time.getMinutes(),
      0,
      0
    );

    let shiftEnd = new Date(today);
    shiftEnd.setHours(
      shift.end_time.getHours(),
      shift.end_time.getMinutes(),
      0,
      0
    );

    // Adjust dates for shifts crossing midnight
    if (shiftEnd < shiftStart) {
      shiftEnd.setDate(shiftEnd.getDate() + 1);
    }

    let status = "on-time";
    let minutesDiff = 0;

    const GRACE_PERIOD = 30; // 30 minutes grace period

    if (type === "check-in") {
      minutesDiff = minutesDifference(shiftStart, currentTime);
      if (minutesDiff > GRACE_PERIOD) {
        status = "late";
      } else {
        status = "on-time";
        minutesDiff = 0;
      }
    }

    if (type === "check-out") {
      minutesDiff = minutesDifference(shiftEnd, currentTime);
      if (minutesDiff < -GRACE_PERIOD) {
        status = "early";
        minutesDiff = Math.abs(minutesDiff); // Make minutesDiff positive for early check-outs
      } else {
        status = "on-time";
        minutesDiff = 0;
      }
    }

    const newAttendance = await db.attendance.create({
      data: {
        type,
        employee: { connect: { id: employee.id } },
        timestamp: currentTime,
        reason: reason,
        status: status,
        minutesDifference: minutesDiff,
      },
      include: { employee: true },
    });

    revalidatePath("/staff");
    console.log("Checkin successful", newAttendance);

    return { attendance: newAttendance, employee, type };
  } catch (error) {
    console.error("Error Checkin", error);
    return { error: "Internal error" };
  }
};
