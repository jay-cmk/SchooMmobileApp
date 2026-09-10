/* =====================================================
   NOTIFICATION TYPE
===================================================== */

export type NotificationType =
  | "SUBJECT_ASSIGNED"
  | "ELECTIVE_ASSIGNED"
  | "HOMEWORK_ASSIGNED"
  | "STUDENT_ABSENT"
  | "TIMETABLE_CHANGED"
  | "GENERAL_NOTICE";


/* =====================================================
   PRIORITY
===================================================== */

export type NotificationPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH";


/* =====================================================
   SOUND
===================================================== */

export type NotificationSound =
  | "DEFAULT"
  | "IMPORTANT"
  | "NONE";


/* =====================================================
   DELIVERY CHANNEL
===================================================== */

export type NotificationChannel =
  | "IN_APP"
  | "PUSH";


/* =====================================================
   RECIPIENT ROLE
===================================================== */

export type NotificationRecipientRole =
  | "SCHOOL_ADMIN"
  | "TEACHER"
  | "STUDENT";


/* =====================================================
   METADATA

   Notification click होने पर navigation इसी data
   के आधार पर होगी।
===================================================== */

export interface NotificationMetadata {
  screen?: string;

  url?: string;

  subjectId?: string;

  assignmentId?: string;

  studentSubjectEnrollmentId?: string;

  homeworkId?: string;

  attendanceId?: string;

  timetableId?: string;

  classId?: string;

  sectionId?: string;

  sessionId?: string;

  teacherId?: string;

  studentId?: string;

  stream?: string;

  sessionName?: string;

  weeklyPeriods?: number;

  [key: string]:
    | string
    | number
    | boolean
    | undefined;
}


/* =====================================================
   NOTIFICATION DATA
===================================================== */

export interface NotificationData {
  _id: string;

  schoolId: string;

  recipientUserId: string;

  recipientRole:
    NotificationRecipientRole;

  type:
    NotificationType;

  title: string;

  message: string;

  priority:
    NotificationPriority;

  sound:
    NotificationSound;

  channels:
    NotificationChannel[];

  metadata?:
    NotificationMetadata;

  isRead: boolean;

  readAt?: string;

  createdAt: string;

  updatedAt: string;
}


/* =====================================================
   PAGINATION
===================================================== */

export interface NotificationPagination {
  total: number;

  page: number;

  limit: number;

  totalPages: number;
}


/* =====================================================
   GET NOTIFICATIONS PARAMS
===================================================== */

export interface GetNotificationsParams {
  type?:
    NotificationType;

  isRead?: boolean;

  page?: number;

  limit?: number;
}


/* =====================================================
   NOTIFICATION LIST DATA
===================================================== */

export interface NotificationListData {
  notifications:
    NotificationData[];

  pagination:
    NotificationPagination;

  unreadCount: number;
}


/* =====================================================
   NOTIFICATION LIST RESPONSE
===================================================== */

export interface NotificationListResponse {
  success: boolean;

  message: string;

  data:
    NotificationListData;
}


/* =====================================================
   UNREAD COUNT RESPONSE
===================================================== */

export interface UnreadCountResponse {
  success: boolean;

  message: string;

  data: {
    unreadCount: number;
  };
}


/* =====================================================
   SINGLE NOTIFICATION RESPONSE
===================================================== */

export interface NotificationResponse {
  success: boolean;

  message: string;

  data: {
    notification:
      NotificationData;
  };
}


/* =====================================================
   MARK ALL READ RESPONSE
===================================================== */

export interface MarkAllReadResponse {
  success: boolean;

  message: string;

  data: {
    modifiedCount: number;
  };
}


/* =====================================================
   DEVICE PLATFORM

   DeviceTokenData backend का shared response है, इसलिए
   WEB भी यहां रखा गया है।
===================================================== */

export type DevicePlatform =
  | "ANDROID"
  | "IOS"
  | "WEB";


/* =====================================================
   MOBILE DEVICE PLATFORM

   Mobile registration WEB नहीं भेज सकती।
===================================================== */

export type MobileDevicePlatform =
  | "ANDROID"
  | "IOS";


/* =====================================================
   PUSH TOKEN TYPE
===================================================== */

export type PushTokenType =
  | "EXPO"
  | "FCM";


/* =====================================================
   REGISTER MOBILE DEVICE PAYLOAD

   Mobile केवल Expo push token भेजेगा।
===================================================== */

export interface RegisterDevicePayload {
  platform:
    MobileDevicePlatform;

  tokenType:
    "EXPO";

  token: string;

  deviceId: string;

  deviceName?: string;
}


/* =====================================================
   DEVICE TOKEN DATA
===================================================== */

export interface DeviceTokenData {
  _id: string;

  schoolId: string;

  userId: string;

  platform:
    DevicePlatform;

  tokenType:
    PushTokenType;

  token: string;

  deviceId: string;

  deviceName?: string;

  isActive: boolean;

  lastUsedAt: string;

  createdAt: string;

  updatedAt: string;
}


/* =====================================================
   DEVICE TOKEN RESPONSE
===================================================== */

export interface DeviceTokenResponse {
  success: boolean;

  message: string;

  data: {
    device:
      DeviceTokenData;
  };
}


/* =====================================================
   DELETE NOTIFICATION RESPONSE
===================================================== */

export interface DeleteNotificationResponse {
  success: boolean;

  message: string;
}


/* =====================================================
   NOTIFICATION REDUX STATE
===================================================== */

export interface NotificationState {
  notifications:
    NotificationData[];

  unreadCount: number;

  pagination:
    NotificationPagination | null;

  loading: boolean;

  refreshing: boolean;

  registeringDevice: boolean;

  error:
    string | null;

  initialized: boolean;
}