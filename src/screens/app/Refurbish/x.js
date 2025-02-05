import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, ImageBackground, FlatList, ScrollView, RefreshControl, Alert, Platform } from 'react-native';
import { Text, View } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import InvoiceText from '../../../components/invoiceText/invoiceText';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import { convertDate, formatNumberWithCommas, getName, getWelcomeName, numberToWords } from '../../../constants/categories';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { setGeneratedRefurbishInvoiceList, setRefurbishInvoiceList, setToUpdate, setUserName } from '../../../store/invoices';
import { htmlStyles } from '../../../constants/styles';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { refurbishStyles } from '../../../constants/refurbishStyles';

const GeneratedRefurbishInvoice = ({ route }) => {
  const user = useSelector((state) => state?.invoices?.user);
  const localInvoiceList = useSelector((state) => state?.invoices?.RefurbishInvoiceList);
  const [invoiceList, setLocalInvoiceList] = useState(localInvoiceList);
  const [refreshing, setRefreshing] = useState(false);
  const [count, setCount] = useState(1);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUserName(user));
      }
    });
    return () => unsubscribe();
  }, [user, dispatch]);

  const fetchInvoices = useCallback(async () => {
    try {
      const querySnapshot = await firestore()
        .collection('GeneratedRefurbishInvoice')
        .where('userId', '==', user?.uid)
        .get();

      const newProductItem = [];
      querySnapshot.forEach((documentSnapshot) => {
        newProductItem.push({
          uid: documentSnapshot.id,
          ...(documentSnapshot.data() || {}),
        });
      });

      const sortedGeneratedInvoice = newProductItem.sort((a, b) => b.invoiceDate - a.invoiceDate);
      const targetInvoice = sortedGeneratedInvoice.find((invoice) => invoice.uid === invoiceList.uid);
      dispatch(setGeneratedRefurbishInvoiceList(targetInvoice));
      setLocalInvoiceList(targetInvoice);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  }, [user, invoiceList.uid, dispatch]);

  useEffect(() => {
    if (isFocused) {
      fetchInvoices();
    }
  }, [isFocused, fetchInvoices]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchInvoices();
    setRefreshing(false);
  }, [fetchInvoices]);

  const sanitizeFileName = (name) => {
    return name.replace(/[^a-zA-Z0-9]/g, ' ');
  };

  const generateUniqueFileName = async (baseName, folderPath) => {
    const maxRetries = 100;
    let retryCount = 0;
    let fileName;
    let filePath;

    while (retryCount < maxRetries) {
      const randomNumber = Math.floor(Math.random() * 20) + 1;
      fileName = `${baseName}(${randomNumber}).pdf`;
      filePath = `${folderPath}/${fileName}`;

      if (!(await RNFS.exists(filePath))) {
        return fileName;
      }

      retryCount++;
    }
    Alert.alert('Unable to generate a unique file name after multiple attempts');
    throw new Error('Unable to generate a unique file name after multiple attempts');
  };

  const createPDF = async () => {
    const baseName = `${sanitizeFileName(invoiceList?.invoiceType)}_${sanitizeFileName(invoiceList?.CompanyName)}(${count})`;
    const htmlContentPage = `${pdfContent()?.join('')}`;

    try {
      let options = {
        html: htmlContentPage,
        fileName: baseName,
        base64: true,
      };

      const pdf = await RNHTMLtoPDF.convert(options);

      if (pdf.base64) {
        const folderPath =
          Platform.OS === 'android' ? `${RNFS.DownloadDirectoryPath}/Cristo Invoice` : `${RNFS.DocumentDirectoryPath}/Cristo Invoice`;

        const folderExists = await RNFS.exists(folderPath);
        if (!folderExists) {
          await RNFS.mkdir(folderPath);
        }
        const uniqueFileName = await generateUniqueFileName(baseName, folderPath);
        const filePath = `${folderPath}/${uniqueFileName}`;

        await RNFS.writeFile(filePath, pdf.base64, 'base64');

        Alert.alert('Success', `PDF saved at: /internal storage/Download/Cristo Invoice/${uniqueFileName}`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open', onPress: () => openFile(filePath) },
        ]);
        setCount(count + 1);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to create PDF. Please try again.');
    }
  };

  const openFile = async (filepath) => {
    try {
      await FileViewer.open(filepath);
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert('Error', 'Failed to open PDF file. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await firestore()
        .collection('GeneratedRefurbishInvoice')
        .doc(invoiceList?.uid)
        .delete()
        .then(() => {
          dispatch(setToUpdate());
          navigation.navigate('GeneratedRefurbishInvoiceList');
        });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Generated Refurbish Invoice" />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ImageBackground source={require('../../../assets/background.png')} style={styles.background}>
          <FlatList
            data={invoiceList?.items || []}
            renderItem={({ item }) => <InvoiceText item={item} />}
            keyExtractor={(item) => item.id}
          />
          <View>
            <Text>Invoice Date: {dateFormatted}</Text>
            <Text>Company Name: {getName(invoiceList?.CompanyName)}</Text>
            {/* Additional Invoice Details */}
            <Button title="Edit" onPress={handleNavigateEditInvoice} />
            <Button title="Delete" onPress={handleDelete} />
            <Button title="Create PDF" onPress={createPDF} />
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GeneratedRefurbishInvoice;
