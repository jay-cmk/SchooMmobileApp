import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface SplashPortalProps {
  children: React.ReactNode;
}

interface LoadingIndicatorProps {
  isLoading: boolean;
}

interface ContinueButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const SplashPortal: React.FC<SplashPortalProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-secondary/60 animate-pulse pointer-events-none" />
      <div className="absolute bottom-24 -left-14 h-40 w-40 rounded-full bg-accent/60 animate-pulse pointer-events-none" />
      {children}
    </div>
  );
};

const BrandHeader: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] bg-primary text-primary-foreground shadow-md animate-bounce">
        <Icon icon="lucide:graduation-cap" className="text-5xl" />
      </div>
      <p className="mb-2 text-sm font-semibold tracking-[0.22em] text-primary">NORTHSTAR ACADEMY</p>
      <h1 className="text-3xl font-heading font-bold text-foreground text-balance">Learn with confidence.</h1>
      <p className="mt-3 text-base text-muted-foreground">Student Portal</p>
    </div>
  );
};

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading }) => {
  if (!isLoading) {
    return (
      <div className="mt-14 flex items-center gap-2 text-sm font-medium text-emerald-600 animate-fade-in">
        <Icon icon="lucide:check-circle" className="w-5 h-5 text-emerald-500" />
        Ready to begin
      </div>
    );
  }

  return (
    <div className="mt-14 flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
      Preparing your day
    </div>
  );
};

const ContinueButton: React.FC<ContinueButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute bottom-10 left-6 right-6 min-h-11 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-300 active:scale-95 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90 cursor-pointer'
      }`}
    >
      Continue
    </button>
  );
};

const Splash: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'login' | 'dashboard'>('splash');
  const [studentId, setStudentId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (!isLoading) {
      setCurrentScreen('login');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !password) {
      setLoginError('Please fill in all fields.');
      return;
    }
    setLoginError('');
    setIsLoggingIn(true);

    setTimeout(() => {
      setIsLoggingIn(false);
      setCurrentScreen('dashboard');
    }, 1500);
  };

  const handleLogout = () => {
    setStudentId('');
    setPassword('');
    setCurrentScreen('splash');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <SplashPortal>
      {/* Injecting custom CSS variables and styles to match original design */}
      <style>{`
        :root {
          --background: #F7F7FB;
          --foreground: #15213B;
          --primary: #4355D8;
          --primary-foreground: #FFFFFF;
          --secondary: #EEF0FF;
          --secondary-foreground: #27327C;
          --tertiary: #2BAA7B;
          --muted: #EFF1F6;
          --muted-foreground: #606F88;
          --accent: #FFF2DE;
          --accent-foreground: #7D4B0A;
          --card: #FFFFFF;
          --card-foreground: #15213B;
          --destructive: #DC4C5A;
          --border: #E5E8F0;
          --input: #D8DDEA;
          --ring: #4355D8;
          --radius: 1.25rem;
        }
        body {
          background-color: var(--background);
          color: var(--foreground);
        }
      `}</style>

      {currentScreen === 'splash' && (
        <>
          <main className="flex flex-1 flex-col items-center justify-center px-8 text-center relative">
            <BrandHeader />
            <LoadingIndicator isLoading={isLoading} />
          </main>
          <ContinueButton onClick={handleContinue} disabled={isLoading} />
        </>
      )}

      {currentScreen === 'login' && (
        <main className="flex flex-1 flex-col justify-center px-8 relative z-10">
          <button 
            onClick={() => setCurrentScreen('splash')}
            className="absolute top-6 left-6 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <Icon icon="lucide:arrow-left" className="w-4 h-4" />
            Back
          </button>

          <div className="w-full max-w-md mx-auto bg-card p-8 rounded-2xl shadow-lg border border-border">
            <div className="text-center mb-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary mb-4">
                <Icon icon="lucide:lock" className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
              <p className="text-sm text-muted-foreground mt-1">Sign in to access your student portal</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Student ID
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Icon icon="lucide:user" className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. NS-2024-08"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Icon icon="lucide:key-round" className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-xs text-destructive font-medium flex items-center gap-1">
                  <Icon icon="lucide:alert-circle" className="w-4 h-4" />
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full min-h-11 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </main>
      )}

      {currentScreen === 'dashboard' && (
        <main className="flex flex-1 flex-col p-6 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {studentId.substring(0, 2).toUpperCase() || 'ST'}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Welcome, Student</h3>
                <p className="text-xs text-muted-foreground">{studentId}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-destructive hover:text-white transition-colors"
              title="Sign Out"
            >
              <Icon icon="lucide:log-out" className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
              <div className="text-primary mb-2">
                <Icon icon="lucide:book-open" className="w-6 h-6" />
              </div>
              <p className="text-xs text-muted-foreground">Active Courses</p>
              <p className="text-lg font-bold text-foreground mt-1">4 Courses</p>
            </div>
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
              <div className="text-emerald-600 mb-2">
                <Icon icon="lucide:award" className="w-6 h-6" />
              </div>
              <p className="text-xs text-muted-foreground">Current GPA</p>
              <p className="text-lg font-bold text-foreground mt-1">3.85</p>
            </div>
          </div>

          <div className="bg-card p-5 rounded-2xl border border-border shadow-sm mb-6">
            <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Icon icon="lucide:calendar" className="text-primary" /> Today's Schedule
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                <div>
                  <p className="text-xs font-semibold text-foreground">Advanced Mathematics</p>
                  <p className="text-[10px] text-muted-foreground">Room 402 • Prof. Davis</p>
                </div>
                <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-accent text-accent-foreground">
                  09:00 AM
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                <div>
                  <p className="text-xs font-semibold text-foreground">Computer Science 101</p>
                  <p className="text-[10px] text-muted-foreground">Lab B • Dr. Carter</p>
                </div>
                <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                  11:30 AM
                </span>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20 flex items-start gap-3">
            <Icon icon="lucide:info" className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-primary">Midterm Exams Notice</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Midterm schedules have been published. Please check your registered email for details.
              </p>
            </div>
          </div>
        </main>
      )}
    </SplashPortal>
  );
};

export default Splash;




// import React, { useEffect } from "react";

// import {
//   ActivityIndicator,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// import type {
//   NativeStackScreenProps,
// } from "@react-navigation/native-stack";



// import {
//   restoreAuth,
// } from "../../features/auth/auth.slice";




// import { useAppSelector,useAppDispatch } from "@/store/hook";
// import { UserRole } from "types/auth.types";
// import { RootStackParamList } from "types/navigation.types";

// type Props = NativeStackScreenProps<
//   RootStackParamList,
//   "Splash"
// >;

// const SplashScreen: React.FC<Props> = ({
//   navigation,
// }) => {
//   const dispatch = useAppDispatch();

//   const {
//     user,
//     accessToken,
//     initializing,
//   } = useAppSelector(
//     (state) => state.auth
//   );

//   useEffect(() => {
//     dispatch(restoreAuth());
//   }, [dispatch]);

//   useEffect(() => {
//     if (initializing) {
//       return;
//     }

//     if (
//       accessToken &&
//       user?.role === UserRole.STUDENT
//     ) {
//       navigation.reset({
//         index: 0,
//         routes: [
//           {
//             name: "StudentApp",
//           },
//         ],
//       });

//       return;
//     }

//     navigation.reset({
//       index: 0,
//       routes: [
//         {
//           name: "Login",
//         },
//       ],
//     });
//   }, [
//     initializing,
//     accessToken,
//     user,
//     navigation,
//   ]);

//   return (
//     <View style={styles.container}>
//       <View style={styles.logoContainer}>
//         <Text style={styles.logoEmoji}>
//           🎓
//         </Text>
//       </View>

//       <Text style={styles.academy}>
//         NORTHSTAR ACADEMY
//       </Text>

//       <Text style={styles.title}>
//         Learn with confidence.
//       </Text>

//       <Text style={styles.subtitle}>
//         Student Portal
//       </Text>

//       <View style={styles.loadingContainer}>
//         <ActivityIndicator
//           size="small"
//           color="#4355D8"
//         />

//         <Text style={styles.loadingText}>
//           Preparing your account
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F7F7FB",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 30,
//   },

//   logoContainer: {
//     width: 112,
//     height: 112,
//     borderRadius: 32,
//     backgroundColor: "#4355D8",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 32,

//     shadowColor: "#000",
//     shadowOpacity: 0.12,
//     shadowRadius: 12,
//     shadowOffset: {
//       width: 0,
//       height: 6,
//     },

//     elevation: 5,
//   },

//   logoEmoji: {
//     fontSize: 52,
//   },

//   academy: {
//     fontSize: 13,
//     fontWeight: "700",
//     letterSpacing: 2.5,
//     color: "#4355D8",
//     marginBottom: 10,
//   },

//   title: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: "#15213B",
//     textAlign: "center",
//   },

//   subtitle: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "#606F88",
//   },

//   loadingContainer: {
//     marginTop: 52,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },

//   loadingText: {
//     fontSize: 14,
//     color: "#606F88",
//     fontWeight: "500",
//   },
// });