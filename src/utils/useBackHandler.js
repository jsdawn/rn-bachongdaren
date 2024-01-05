
const {useEffect} = require('react');
const {BackHandler} = require('react-native');

const useBackHandler = () => {
  const handleBackPress = () => {
    return true;
  };

  useEffect(() => {
    // 禁用系统返回键
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);
};

export default useBackHandler;
