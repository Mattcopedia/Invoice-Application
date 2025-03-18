import { Dimensions, StyleSheet } from "react-native";
import colors from "../../constants/colors";
const {width,height} = Dimensions.get("screen"); 
 


 const styles = StyleSheet.create({
    container: {
        width: width * 1,
        height: height * 0.3,
        alignItems: 'center', 
      },
      image: {
        flex: 0.6,
        width: '60%',
      },
      content: {
        flex: 0.4,
        alignItems: 'center',
      },
      title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
      },
      description: {
        fontSize: 14,
        marginVertical: 12,
        color: '#333',
      },
      price: {
        fontSize: 32,
        fontWeight: 'bold',
      }, 
    container2: {
    position: 'absolute',
    bottom: 35,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6, 
    marginHorizontal: 3,
    backgroundColor: '#ccc', 
  },
  alignDot: {
    paddingTop: 20    
  },
  dotActive: {
    backgroundColor: '#000',
  },
  container5: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container23: {
    marginBottom:  height * 0.1 
  },
  imageBackground: { 
    width: width * 1,
    height: height * 0.3,
  },
  overlay: {
    position: 'absolute',
    top: '0%', 
    left: 20,
    right: 20,
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 10,  
  },

  overlay1: {
    position: 'absolute', 
    top: '20%', 
    left: 20,
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 10, 
  },

  overlay2: {
    position: 'absolute', 
    top: '60%', 
    left: 20,
    right: 20,
    alignItems: 'flex-start', 
    padding: 10, 
    borderRadius: 10, 
  },

  labelPhoto: {
    fontSize: 23, 
    fontWeight: '500',
    color: colors.purple,
    backgroundColor: colors.lightGrey, 
    padding: 4,
    borderRadius: 3
  }, 
  text2: {
    color: colors.white,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',  
    padding: 4,
    borderRadius: 3
  }
})

export default styles