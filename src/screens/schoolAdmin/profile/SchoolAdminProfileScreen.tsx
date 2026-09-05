import React, {
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../store/hook";

import {
  logout,
} from "../../../features/auth/auth.slice";


/* =====================================================
   INFO ROW
===================================================== */

interface InfoRowProps {
  icon:
    React.ComponentProps<
      typeof Ionicons
    >["name"];

  label: string;

  value?: string;
}


const InfoRow = ({
  icon,
  label,
  value,
}: InfoRowProps) => {
  if (!value) {
    return null;
  }


  return (
    <View className="flex-row items-center border-b border-[#EEF0F5] py-4">

      <View className="h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF0FF]">

        <Ionicons
          name={icon}
          size={19}
          color="#4355D8"
        />

      </View>


      <View className="ml-3 flex-1">

        <Text className="text-[9px] font-extrabold tracking-wider text-[#8A94A6]">
          {label}
        </Text>

        <Text
          numberOfLines={2}
          className="mt-1 text-sm font-bold text-[#15213B]"
        >
          {value}
        </Text>

      </View>

    </View>
  );
};


/* =====================================================
   SCREEN
===================================================== */

const SchoolAdminProfileScreen =
  () => {
    const dispatch =
      useAppDispatch();


    /* ===================================================
       AUTH USER
    =================================================== */

    const {
      user,
    } = useAppSelector(
      (state) =>
        state.auth
    );


    /* ===================================================
       LOGOUT STATE
    =================================================== */

    const [
      loggingOut,
      setLoggingOut,
    ] = useState(false);


    /* ===================================================
       USER INITIAL
    =================================================== */

    const userInitial =
      useMemo(() => {
        if (!user?.name) {
          return "A";
        }

        return user.name
          .trim()
          .charAt(0)
          .toUpperCase();
      }, [user?.name]);


    /* ===================================================
       ROLE LABEL
    =================================================== */

    const roleLabel =
      useMemo(() => {
        if (!user?.role) {
          return "";
        }

        return user.role
          .replace(
            /_/g,
            " "
          )
          .toLowerCase()
          .replace(
            /\b\w/g,
            (letter) =>
              letter.toUpperCase()
          );
      }, [user?.role]);


    /* ===================================================
       LOGOUT
    =================================================== */

    const performLogout =
      async () => {
        try {
          setLoggingOut(true);

          await dispatch(
            logout()
          );

          /*
           * RootNavigator automatically
           * Login screen par chala jayega
           * jab user/accessToken null hoga.
           */
        } catch (
          error
        ) {
          console.log(
            "SCHOOL ADMIN LOGOUT ERROR:",
            error
          );

          Alert.alert(
            "Logout Failed",
            "Logout nahi ho saka. Dobara try karein."
          );

          setLoggingOut(false);
        }
      };


    const handleLogout =
      () => {
        Alert.alert(
          "Logout",
          "Kya aap logout karna chahte hain?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Logout",
              style:
                "destructive",
              onPress:
                performLogout,
            },
          ]
        );
      };


    /* ===================================================
       UI
    =================================================== */

    return (
      <SafeAreaView
        edges={[
          "top",
          "left",
          "right",
        ]}
        className="flex-1 bg-[#F7F7FB]"
      >

        {/* HEADER */}

        <View className="px-5 pb-5 pt-4">

          <Text className="text-3xl font-extrabold text-[#15213B]">
            Profile
          </Text>

          <Text className="mt-1 text-sm text-[#606F88]">
            School administrator account
          </Text>

        </View>


        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={
            false
          }
          contentContainerClassName="px-5 pb-12"
        >

          {/* =============================================
              PROFILE CARD
          ============================================= */}

          <View className="overflow-hidden rounded-[30px] bg-[#4355D8]">

            <View className="items-center px-5 pb-7 pt-8">

              {/* AVATAR */}

              <View className="h-24 w-24 items-center justify-center rounded-[30px] bg-white">

                <Text className="text-4xl font-extrabold text-[#4355D8]">
                  {userInitial}
                </Text>

              </View>


              {/* NAME */}

              <Text
                numberOfLines={2}
                className="mt-5 text-center text-2xl font-extrabold text-white"
              >
                {user?.name ??
                  "School Admin"}
              </Text>


              {/* ROLE */}

              {roleLabel ? (
                <View className="mt-3 rounded-full bg-white/15 px-4 py-2">

                  <Text className="text-[10px] font-extrabold tracking-wider text-white">
                    {roleLabel.toUpperCase()}
                  </Text>

                </View>
              ) : null}


              {/* EMAIL */}

              {user?.email ? (
                <View className="mt-4 flex-row items-center">

                  <Ionicons
                    name="mail-outline"
                    size={15}
                    color="#FFFFFF"
                  />

                  <Text
                    numberOfLines={1}
                    className="ml-2 max-w-[260px] text-xs text-white/80"
                  >
                    {user.email}
                  </Text>

                </View>
              ) : null}

            </View>

          </View>


          {/* =============================================
              ACCOUNT INFORMATION
          ============================================= */}

          <View className="mb-3 mt-7">

            <Text className="text-lg font-extrabold text-[#15213B]">
              Account Information
            </Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              Logged-in account details
            </Text>

          </View>


          <View className="rounded-3xl border border-[#E5E8F0] bg-white px-4">

            <InfoRow
              icon="person-outline"
              label="NAME"
              value={
                user?.name
              }
            />


            <InfoRow
              icon="mail-outline"
              label="EMAIL"
              value={
                user?.email
              }
            />


            <InfoRow
              icon="shield-checkmark-outline"
              label="ROLE"
              value={
                roleLabel
              }
            />


            <InfoRow
              icon="business-outline"
              label="SCHOOL ID"
              value={
                user?.schoolId
              }
            />

          </View>


          {/* =============================================
              ACCOUNT SECURITY
          ============================================= */}

          <View className="mb-3 mt-7">

            <Text className="text-lg font-extrabold text-[#15213B]">
              Account
            </Text>

          </View>


          <View className="rounded-3xl border border-[#E5E8F0] bg-white">

            <View className="flex-row items-center p-4">

              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#E7F7F1]">

                <Ionicons
                  name="shield-checkmark-outline"
                  size={21}
                  color="#24976D"
                />

              </View>


              <View className="ml-3 flex-1">

                <Text className="text-sm font-extrabold text-[#15213B]">
                  Secure Account
                </Text>

                <Text className="mt-1 text-xs leading-5 text-[#606F88]">
                  Authentication is protected by your account login.
                </Text>

              </View>

            </View>

          </View>


          {/* =============================================
              LOGOUT
          ============================================= */}

          <Pressable
            disabled={
              loggingOut
            }
            onPress={
              handleLogout
            }
            className={
              loggingOut
                ? "mt-7 flex-row items-center justify-center rounded-2xl bg-[#F4CED3] py-4"
                : "mt-7 flex-row items-center justify-center rounded-2xl bg-[#FDECEE] py-4"
            }
          >

            {loggingOut ? (
              <ActivityIndicator
                size="small"
                color="#DC4C5A"
              />
            ) : (
              <>
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color="#DC4C5A"
                />

                <Text className="ml-2 text-sm font-extrabold text-[#DC4C5A]">
                  Logout
                </Text>
              </>
            )}

          </Pressable>


          <Text className="mt-4 text-center text-[10px] leading-4 text-[#9AA3B2]">
            Logging out will remove your saved login session from this device.
          </Text>

        </ScrollView>

      </SafeAreaView>
    );
  };


export default SchoolAdminProfileScreen;