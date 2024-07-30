// import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Pressable,
  Vibration,
  Button
} from "react-native";
import moment from "moment";

import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState, useEffect, useRef } from "react";

import { colors, font } from "./theme";

import { Canvas, rect, rrect, DiffRect, Rect, Circle, Paint, Group} from "@shopify/react-native-skia";
import  { GestureDetector, Gesture, GestureHandlerRootView} from "react-native-gesture-handler";

import Animated, {useSharedValue, useAnimatedStyle, withSpring,} from 'react-native-reanimated';


const testWidth = 256;
const testHeight = 256;
////***** */

export default function App() {
  const { height, width } = useWindowDimensions();

  // minutes: 5,
  //           seconds: 0,
  //           workmins: 5,
  //           worksecs: 0,
  //           breakMins: 2,
  //           breakSecs: 0,
  //           timerState: 'WORK TIMER',
  //           btnState: 'Start'

  // const [pomInterval, setPomInterval] = useState();
  // const pomInterval = useRef();

  // const [pomBreakInterval, setPomBreakInterval] = useState();

  const [minutes, setMinutes] = useState(25);

  const [seconds, setSeconds] = useState(0);
  const [sessionMinutes, setSessionMinutes] = useState(25);

  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const [workMins, setWorkMins] = useState(25);
  const [workSeconds, setworkSeconds] = useState(0);
  const [breakMins, setBreakMins] = useState(5);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [timerState, setTimerState] = useState("TIMERON");
  const [buttonState, setButtonState] = useState("START");
  const [breakTimerRunning, setBreakTimerRunning] = useState(false);

  const [timerOn, setTimerOn] = useState(false);

  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    setMinutes(sessionMinutes);
  }, [sessionMinutes]);

  useEffect(() => {
    console.log("timerRunning from useEff", timerRunning);

    let pomInterval;

    // setworkSeconds(mins * 60);
    let newSeconds = minutes * 60;
    console.log("timerOn", timerOn);

    if (timerRunning) {
      pomInterval = setInterval(() => {
        // console.log("work seconds", secon);

        if (newSeconds > 0) {
          newSeconds--;
        } else {
          vibrate();
          clearInterval(pomInterval);
          setBreakTimerRunning(true);
        }

        // console.log("newSecon", newSeconds);

        setRemainingSeconds(newSeconds);
        const duration = moment.duration(newSeconds, "seconds");

        const h = duration.hours();
        const m = duration.minutes();
        setMinutes(m);
        const s = duration.seconds();
        setSeconds(s);
      }, 1000);

      return () => {
        setTimerOn(false);
        clearInterval(pomInterval);
        console.log("fired");
        // setMinutes(5);
        // setSeconds(0);
      };
    }
  }, [timerRunning]);



  useEffect(() => {
    let newSeconds = breakMins * 60;
    console.log("Break timerOn first", breakTimerRunning);

    let pomBreakInterval;

    if (breakTimerRunning) {
      console.log("Break timerOn", breakTimerRunning);

      const breakDuration = moment.duration(newSeconds, "seconds");

      const breakM = breakDuration.minutes();
      setMinutes(breakM);
      const breakS = breakDuration.seconds();
      setSeconds(breakS);
      pomBreakInterval = setInterval(() => {
        // console.log("work seconds", secon);

        if (newSeconds > 0) {
          newSeconds--;
        } else {
          vibrate();

          clearInterval(pomBreakInterval);
        }

        // console.log("newSecon", newSeconds);

        setRemainingSeconds(newSeconds);
        const duration = moment.duration(newSeconds, "seconds");

        const h = duration.hours();
        const m = duration.minutes();
        setMinutes(m);
        const s = duration.seconds();
        setSeconds(s);
      }, 1000);

      return () => {
        clearInterval(pomBreakInterval);
      };
    }
  }, [breakTimerRunning]);

  const onPressPlusSessionBtn = () => {
    setSessionMinutes((sessionMinutes) => sessionMinutes + 1);
  };
  const onPressMinusSessionBtn = () => {
    if (sessionMinutes > 1) {
      setSessionMinutes((sessionMinutes) => sessionMinutes - 1);
    } else {
      return;
    }
  };

  const onPressPlusBreakBtn = () => {
    setBreakMins(breakMins + 1);
  };
  const onPressMinusBreakBtn = () => {
    if (breakMins > 1) {
      setBreakMins(breakMins - 1);
    } else {
      return;
    }
  };
  vibrate = () => {
    Vibration.vibrate([500, 500, 500]);
  };

  const stopTimer = () => {
    clearInterval(pomInterval);
    setTimerOn(false);
  };

  const resetTimer = () => {
    setTimerOn(false);
    setTimerRunning(false);
    setBreakTimerRunning(false);

    setMinutes(25);
    setSeconds(0);
    setSessionMinutes(25);
    setBreakMins(5);
  };

  const pauseTimer = () => {
    setTimerOn(false);
    setTimerRunning(false);
  };
  const runTimer = () => {
    // setworkSeconds(minutes * 60);
    // console.log("minutes", minutes);
    // setworkSeconds(minutes * 60);
    setTimerRunning(true);
    setTimerOn(true);

    // pomTimer(minutes * 60);
    console.log("from runTImer", timerOn);
    console.log("from runningTImer", timerRunning);
  };

  // const timerStartFunc = () => {
  //   setInterval(() => {
  //     setSeconds((oldSec) => oldSec - 1);
  //     console.log(seconds);
  //     if (seconds === 10) {
  //       setMinutes((min) => min - 1);
  //       clearInterval(setSeconds(0));
  //     }
  //   }, 1000);
  // };

  const testR = testWidth / 10;


 
  return (
    <GestureHandlerRootView>
    <SafeAreaView style={[styles.container]}>



    



      <View
        style={[
          
          styles.upperBar,
          { width: width * 0.9, marginTop: height * 0.1 },
        ]}
      >
        <Pressable onPress={resetTimer}>
          <MaterialIcons name="replay" size={24} color={colors.button} />
        </Pressable>
        <Pressable>
          <MaterialIcons name="music-note" size={24} color={colors.button} />
        </Pressable>
      </View>

 
      
      <Canvas style={{width, height, flex:2}}>



          <Group style="stroke" strokeWidth={20} >

            <Circle cx={width/2} cy={3 * testR} r={2*testR}/>


          </Group>




      </Canvas>

 
      
     

      

      <View style={styles.middleBar}>
        <Text
          style={[{ fontSize: 50, fontWeight: 900, color: colors.button1 }]}
        >
          {minutes > 9 ? minutes : `0` + minutes}:
          {seconds < 10 ? `0` + seconds : seconds}
        </Text>
      </View>
      <View style={[{ marginBottom: height * 0.2 }]}>
        <View
          style={[
            styles.lowerBar,
            { marginBottom: height * 0.03, width: width * 0.5 },
          ]}
        >
          <Pressable onPress={onPressPlusSessionBtn}>
            <FontAwesome6 name="plus" size={24} color={colors.button1} />
          </Pressable>
          <View style={[styles.middleLowerBar]}>
            <Text
              style={[
                { fontSize: 30, fontWeight: font, color: colors.button1 },
              ]}
            >
              {sessionMinutes}
            </Text>
            <Text
              style={[{ fontSize: 20, fontWeight: 100, color: colors.button1 }]}
            >
              session
            </Text>
          </View>
          <Pressable onPress={onPressMinusSessionBtn}>
            <FontAwesome6 name="minus" size={24} color={colors.button1} />
          </Pressable>
        </View>

        <View
          style={[
            styles.lowerBar,
            { marginBottom: height * 0.1, width: width * 0.5 },
          ]}
        >
          <Pressable onPress={onPressPlusBreakBtn}>
            <FontAwesome6 name="plus" size={24} color={colors.button1} />
          </Pressable>
          <View style={[styles.middleLowerBar]}>
            <Text
              style={[
                { fontSize: 30, fontWeight: font, color: colors.button1 },
              ]}
            >
              {breakMins}
            </Text>
            <Text
              style={[{ fontSize: 20, fontWeight: 100, color: colors.button1 }]}
            >
              Break
            </Text>
          </View>
          <Pressable onPress={onPressMinusBreakBtn}>
            <FontAwesome6 name="minus" size={24} color={colors.button1} />
          </Pressable>
        </View>
        {timerOn ? (
          <Pressable
            style={[
              styles.lowerBtn,
              { backgroundColor: timerOn ? colors.bg : colors.button1 },
            ]}
            onPress={pauseTimer}
            disabled={timerOn ? true : false}
          >
            <Text
              style={[{ textAlign: "center", fontSize: 25, color: colors.bg }]}
            >
              PAUSE
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={[
              styles.lowerBtn,
              { backgroundColor: timerOn ? colors.bg : colors.button },
            ]}
            onPress={runTimer}
            disabled={timerOn ? true : false}
          >
            <Text
              style={[{ textAlign: "center", fontSize: 25, color: colors.bg }]}
            >
              START
            </Text>
          </Pressable>
        )}
      </View>
      


     
    </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // backgroundColor: "red",
    alignItems: "center",
    justifyContent: "space-between",
  },
  upperBar: {
    flexDirection: "row",
    // marginTop: 80,
    // backgroundColor: "blue",
    // padding: 10,

    alignItems: "flex-start",

    justifyContent: "space-between",
  },
  lowerBar: {
    flexDirection: "row",
    // marginTop: 80,
    // backgroundColor: "blue",
    // padding: 10,

    alignItems: "center",

    justifyContent: "space-between",
  },
  middleBar: {},
  iconBtn: {
    // marginRight: 10,

    color: colors.button1,
  },
  middleLowerBar: {
    flexDirection: "column",
    // marginTop: 80,
    // backgroundColor: "blue",
    // padding: 10,

    alignItems: "center",

    justifyContent: "center",
  },
  lowerBtn: {
    padding: 10,
    backgroundColor: colors.button,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    textAlign: "center",
  },
  ball: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'blue',
    alignSelf: 'center',
  },
  box: {
    height: 60,
    width: 40,
    backgroundColor: 'red',
    borderRadius: 20,
    marginVertical: 10,
  },
  canvas:{
    backgroundColor:"red"
  }
});

// vibrate = () => {
//   Vibration.vibrate([500, 500, 500])
// }

// if(newSec <= 0 && this.state.minutes <= 0) {
//   this.vibrate();
//   if(this.state.timerState == 'WORK TIMER') {
//       this.setState({
//           timerState: 'BREAK TIMER',
//           minutes: this.state.breakMins,
//           seconds: this.state.breakSecs
