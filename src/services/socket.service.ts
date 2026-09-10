import {
  io,
} from "socket.io-client";

import type {
  Socket,
} from "socket.io-client";

import api from "../api/axios";

import {
  getAccessToken,
} from "../storage/authStorage";

import type {
  NotificationData,
} from "../features/notifications/notification.types";


/* =====================================================
   SERVER EVENT PAYLOADS
===================================================== */

interface SocketReadyData {
  success: boolean;
  userId: string;
}


/* =====================================================
   SOCKET TYPE

   Installed socket.io-client version io() पर generic
   arguments support नहीं कर रहा, इसलिए सामान्य Socket
   type इस्तेमाल किया गया है।
===================================================== */

type AppSocket = Socket;


/* =====================================================
   SOCKET INSTANCE
===================================================== */

let socket: AppSocket | null =
  null;


/* =====================================================
   GET SOCKET SERVER URL

   Axios:
   http://IP:5000/api/v1

   Socket:
   http://IP:5000
===================================================== */

const getSocketUrl = (): string => {
  const apiUrl =
    api.defaults.baseURL;

  if (
    !apiUrl ||
    typeof apiUrl !== "string"
  ) {
    throw new Error(
      "API base URL is missing",
    );
  }

  /*
   * Examples:
   *
   * http://localhost:5000/api/v1
   * becomes:
   * http://localhost:5000
   *
   * http://192.168.1.5:5000/api/v1/
   * becomes:
   * http://192.168.1.5:5000
   */
  return apiUrl
    .replace(
      /\/api\/v\d+\/?$/,
      "",
    )
    .replace(
      /\/$/,
      "",
    );
};


/* =====================================================
   CONNECT SOCKET

   Login/restoreAuth successful होने के बाद call करें।
===================================================== */

export const connectSocket =
  async (): Promise<AppSocket | null> => {
    const token =
      await getAccessToken();

    if (!token) {
      console.log(
        "Socket connection skipped: access token not found",
      );

      return null;
    }

    const socketUrl =
      getSocketUrl();


    /* ===============================================
       REUSE EXISTING SOCKET
    =============================================== */

    if (socket) {
      socket.auth = {
        token,
      };

      if (!socket.connected) {
        socket.connect();
      }

      return socket;
    }


    /* ===============================================
       CREATE SOCKET

       io() के साथ generic arguments नहीं लगाए गए हैं।
    =============================================== */

    const newSocket = io(
      socketUrl,
      {
        autoConnect: false,

        auth: {
          token,
        },

        transports: [
          "websocket",
          "polling",
        ],

        reconnection: true,

        reconnectionAttempts: 10,

        reconnectionDelay: 1000,

        reconnectionDelayMax: 5000,

        timeout: 15000,
      },
    );

    socket = newSocket;


    /* ===============================================
       CONNECTED
    =============================================== */

    newSocket.on(
      "connect",
      () => {
        console.log(
          "Socket connected:",
          newSocket.id,
        );
      },
    );


    /* ===============================================
       SERVER AUTHENTICATION READY
    =============================================== */

    newSocket.on(
      "socket:ready",
      (
        data: SocketReadyData,
      ) => {
        console.log(
          "Socket authenticated:",
          data.userId,
        );
      },
    );


    /* ===============================================
       CONNECTION ERROR
    =============================================== */

    newSocket.on(
      "connect_error",
      (
        error: Error,
      ) => {
        console.log(
          "Socket connection error:",
          error.message,
        );
      },
    );


    /* ===============================================
       DISCONNECTED
    =============================================== */

    newSocket.on(
      "disconnect",
      (
        reason: string,
      ) => {
        console.log(
          "Socket disconnected:",
          reason,
        );
      },
    );


    /* ===============================================
       CONNECT
    =============================================== */

    newSocket.connect();

    return newSocket;
  };


/* =====================================================
   DISCONNECT SOCKET

   Logout और session expiry पर call करें।
===================================================== */

export const disconnectSocket =
  (): void => {
    if (!socket) {
      return;
    }

    socket.removeAllListeners();

    socket.disconnect();

    socket = null;

    console.log(
      "Socket connection closed",
    );
  };


/* =====================================================
   GET CURRENT SOCKET
===================================================== */

export const getSocket =
  (): AppSocket | null => {
    return socket;
  };


/* =====================================================
   SUBSCRIBE TO NEW NOTIFICATION

   Cleanup callback return होगा।
===================================================== */

export const subscribeToNewNotification =
  (
    listener: (
      notification: NotificationData,
    ) => void,
  ): (() => void) => {
    const currentSocket =
      socket;

    if (!currentSocket) {
      return () => {
        // Socket अभी create नहीं हुआ।
      };
    }

    const notificationListener = (
      notification: NotificationData,
    ): void => {
      listener(notification);
    };

    currentSocket.on(
      "notification:new",
      notificationListener,
    );

    return () => {
      currentSocket.off(
        "notification:new",
        notificationListener,
      );
    };
  };


/* =====================================================
   ACKNOWLEDGE NOTIFICATION

   Optional event है। Backend listener मौजूद होने पर
   notification receive acknowledgement भेज सकता है।
===================================================== */

export const acknowledgeNotification =
  (
    notificationId: string,
  ): void => {
    if (
      !socket ||
      !socket.connected
    ) {
      return;
    }

    socket.emit(
      "notification:received",
      notificationId,
    );
  };


/* =====================================================
   CHECK SOCKET CONNECTION
===================================================== */

export const isSocketConnected =
  (): boolean => {
    return (
      socket?.connected ??
      false
    );
  };