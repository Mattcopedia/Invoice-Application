import React from 'react';
import { Animated, Dimensions, View } from 'react-native';
import styles from './styles';
const {width,height} = Dimensions.get("screen"); 


const Pagination = ({data,scrollX,index}) => { 

  return (
    <View style={styles.container2}>
      {data.map((_, idx) => {
        const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];

        const dotWidth = scrollX.interpolate({ 
          inputRange,
          outputRange: [12, 30, 12],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.2, 1, 0.1], 
          extrapolate: 'clamp',
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ['#ccc', '#000', '#ccc'],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={idx.toString()}
            style={[
              styles.dot,
              {width: dotWidth, backgroundColor},
              idx === index && styles.dotActive,  
            ]}
          />

        );
      })}
    </View>
  )
}

export default React.memo(Pagination) 
