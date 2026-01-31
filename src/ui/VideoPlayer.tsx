import { StyleSheet } from "react-native";
import { useVideoPlayer, VideoView } from "react-native-video";

export default function VideoPlayer({uri}: {uri: string}) {
  const player = useVideoPlayer({
    uri,
  });
  return <VideoView player={player} controls={true} style={styles.video}/>
}

const styles = StyleSheet.create({
   video: {
    width: '100%',
    height: 200,
  },
});