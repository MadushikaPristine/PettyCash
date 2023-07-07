import React, { useEffect, useState } from 'react'
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, NativeSyntheticEvent, TextInputChangeEventData, Animated, Platform, Dimensions, Keyboard } from 'react-native'
import InputText from './InputText'
import ComStyles from "../Constant/Components.styles";
import { Dropdown } from 'react-native-element-dropdown';
import ActionButton from './ActionButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import { getExpenseTypeAll } from '../SQLiteDBAction/Controllers/ExpenseTypeController';
import moment from 'moment';
import { saveJOB } from '../SQLiteDBAction/Controllers/JOBController';

type paramTypes = {

  isJob?: boolean;
  txtNo?: string;
  searchPlaceholder?: string;
  addbtn?: Function;
  cancelbtn?: Function;
  closeModal?: Function;

}

const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];
const AddAnotherJob = ({ isJob, txtNo, addbtn, cancelbtn, searchPlaceholder, closeModal }: paramTypes) => {

  var currentDate = moment().utcOffset('+05:30').format('YYYY-MM-DD');

  const [TicketID, setTicketID] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [error, setError] = useState({ field: '', message: '' })

  //spinner list
  const [ExpenseTypeList, setExpenseTypeList] = useState([]);

  //spinner select 
  const [jobNo, setjobNo] = useState('');
  const [JobOwner, setJobOwner] = useState('');
  const [selectExpenseType, setSelectExpenseType] = useState('');


  //save Job
  const [expenseTypeID, setExpenseTypeID] = useState('');
  const [requestAmount, setrequestAmount] = useState('');
  const [remarks, setRemarks] = useState('')

  const cancelJob = () => {

    setJobOwner('');
    setExpenseTypeID('');
    setrequestAmount('');
    setRemarks('');
    setSelectExpenseType('');

  }



  const add = () => {

    // console.log("addddddddddd /////////// ");

    let jobError = { field: '', message: '' }

    if (JobOwner === '') {

      jobError.field = 'JobOwner'
      jobError.message = 'Job No is required'
      setError(jobError);

    } 
     else if (expenseTypeID === '') {

      jobError.field = 'TicketID'
      jobError.message = 'Expense type is required'
      setError(jobError);

    } else if (requestAmount === '') {

      jobError.field = 'requestAmount'
      jobError.message = 'Amount  is required'
      setError(jobError);

    } else {
      // addbtn 

      // console.log("insert  /////////// ");
      saveJob();
    }

  }

  const saveJob = () => {

    console.log("save job ............>>>>>>>>>>> ");


    const JOBData = [
      {
        Job_NO: jobNo,
        JobOwner_ID: parseInt(JobOwner),
        Expences_Type: parseInt(expenseTypeID),
        Amount: parseFloat(requestAmount),
        Remark: remarks,
        CreateDate: currentDate,
        CreatedBy: 2,
        Status: "0"

      }
    ]

    saveJOB(JOBData, (response: any) => {

      // console.log(" save job .. ", response);

      if(response == 3){

        Alert.alert("Successfully Submitted!");

    
      }else{

        Alert.alert("Failed!");
      }

    });

  }

  const getExpenseTypes = () => {

    getExpenseTypeAll((result: any) => {

      setExpenseTypeList(result);
    });


  }

  useFocusEffect(
    React.useCallback(() => {

      getExpenseTypes();


    }, [])
  );




  //   let jobError = {field: '', message: ''}
  //   if(formValues.map((element, index) => (element.job_no))){
  //     jobError.field = 'job_no';
  //     jobError.message = 'Job_no is required';
  //     setError(jobError);
  //   } else if (formValues.map((element, index) => (element.request_amount))){
  //     jobError.field = 'request_amount';
  //     jobError.message = 'Request amount is required';
  //     setError(jobError);
  //   } else{
  //     setError({field: '', message: ''});
  //     Alert('login successfully')
  //   }
  // }
  // const handleChange = (i, e) => {
  //     const newFormValues = [...formValues];
  //     newFormValues[i][e.target.name] = e.target.value;
  //     setFormValues(newFormValues);
  //   }

  //   const addFormFields = () => {
  //     setFormValues([...formValues, { name: "", email: "", job_no: "", expense_type: "", request_amount: "", remarks: "" }])
  //   }

  //   const removeFormFields = (i) => {
  //     const newFormValues = [...formValues];
  //     newFormValues.splice(i, 1);
  //     setFormValues(newFormValues)
  // }

  // const handleSubmit = (event) => {
  //     event.preventDefault();
  //     alert(JSON.stringify(formValues));
  // }

  return (
    <View style={styles.container}>

      <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center', flexDirection: 'row' }}>

        <TouchableOpacity style={styles.dashStyle} onPress={closeModal} />

      </View>


      <View style={{ padding: 5 }} />
      {/* {formValues.map((element, index) => (
              <View>
                    
                <TextInput placeholder={"Job No"} value={element.job_no} onChange={e => handleChange(index, e)} style={styles.inputContainer}/>
                {error.field === 'job_no' && (
                  <Text style={{color:'red'}}>{error.message}</Text>
                )}      
                <DropdownComponent />

                <TextInput placeholder={"Requested Amount"} value={element.request_amount} onChange={e => handleChange(index, e)} style={styles.inputContainer}/>  
                {error.field === 'request_amount' && (
                  <Text style={{color:'red'}}>{error.message}</Text>
                )}                  
                <TextInput placeholder={"Remarks"} value={element.remarks} onChange={e => handleChange(index, e)} multiline={true}
                    numberOfLines={10}
                    style={[styles.inputContainer, { height:150, textAlignVertical: 'top', backgroundColor: 'white'}]}/>                
                {
                    index ?
                    <ActionButton title='Cancel' onPress={() => removeFormFields(index)}/>
                    : null
                }
              </View>
            ))} */}

      {
        isJob ?

          <Dropdown
            style={[
              styles.dropdown,
              isFocus && { borderColor: ComStyles.COLORS.BORDER_COLOR },
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? txtNo : '...'}
            searchPlaceholder={searchPlaceholder}
            value={JobOwner}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {

              setJobOwner(item.value);


              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isFocus ? 'blue' : 'black'}
                name="Safety"
                size={15}
              />
            )}
          />


          :
          <></>

      }

      {error.field === 'JobOwner' && (
        <Text style={styles.error}>{error.message}</Text>
      )}

      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: ComStyles.COLORS.BORDER_COLOR },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={ExpenseTypeList}
        search
        maxHeight={300}
        labelField="Description"
        valueField="Description"
        placeholder={!isFocus ? 'Expense Type* ' : '...'}
        searchPlaceholder="Search Type"
        value={selectExpenseType}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {

          setSelectExpenseType(item.Description);
          setExpenseTypeID(item.ExpType_ID);


          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? 'blue' : 'black'}
            name="Safety"
            size={15}
          />
        )}
      />
      {error.field === 'TicketID' && (
        <Text style={styles.error}>{error.message}</Text>
      )}

      <InputText
        placeholderColor={ComStyles.COLORS.HEADER_BLACK}
        placeholder="Requested amount(LKR)*"
        stateValue={requestAmount}
        editable={true}
        setState={(val: any) => setrequestAmount(val)}
        style={ComStyles.IOUInput}
      />
      {error.field === 'requestAmount' && (
        <Text style={styles.error}>{error.message}</Text>
      )}

      <InputText
        placeholderColor={ComStyles.COLORS.HEADER_BLACK}
        placeholder="Remarks"
        stateValue={remarks}
        setState={(val: any) => setRemarks(val)}
        editable={true}
        style={ComStyles.IOUInput}
      />

      <View style={{ flexDirection: 'row' }}>

        <ActionButton
          title="Add"
          styletouchable={{ width: '49%' }}
          onPress={() => add()}
        />

        <ActionButton
          title="Cancel"
          styletouchable={{ width: '49%', marginLeft: 5 }}
          style={{ backgroundColor: ComStyles.COLORS.RED_COLOR }}
          onPress={cancelJob} />


      </View>



    </View>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10
  },
  container: {
    padding: 10,
    backgroundColor: ComStyles.COLORS.WHITE,
  },
  inputsContainer: {
    marginBottom: 20
  },
  inputContainer: {

    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  list: {
    flex: 1,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  placeholderStyle: {
    fontFamily: ComStyles.FONT_FAMILY.SEMI_BOLD,
    fontSize: 12,
    color: ComStyles.COLORS.BLACK,
  },
  selectedTextStyle: {
    fontFamily: ComStyles.FONT_FAMILY.SEMI_BOLD,
    fontSize: 12,
    color: ComStyles.COLORS.ICON_BLUE,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  icon: {
    marginRight: 5,
    color: ComStyles.COLORS.HEADER_BLACK,
  },
  error: {
    color: 'red'
  },
  dashStyle: {
    width: 50,
    height: 5,
    backgroundColor: ComStyles.COLORS.DASH_COLOR,
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 10,
  },
})

export default AddAnotherJob;


/*const [inputs, setInputs] = useState([{key: '', value: ''}]);

  const addHandler = ()=>{
    const _inputs = [...inputs];
    _inputs.push({key: '', value: ''});
    setInputs(_inputs);
  }
  
  const deleteHandler = (key)=>{
    const _inputs = inputs.filter((input,index) => index != key);
    setInputs(_inputs);
  }
 
  const inputHandler = (text, key)=>{
    const _inputs = [...inputs];
    _inputs[key].value = text;
    _inputs[key].key   = key;
    setInputs(_inputs);
    
  }
 
  return (
    <View>
      <ScrollView style={styles.inputsContainer}>
      {inputs.map((input, key)=>(
        <View style={styles.inputContainer}>
          <TextInput placeholder={"Enter Name"} value={input.value}  onChangeText={(text)=>inputHandler(text,key)}/>
          <TextInput placeholder={"Enter Age"} value={input.value}  onChangeText={(text)=>inputHandler(text,key)}/>
          <TextInput placeholder={"Enter Name"} value={input.value}  onChangeText={(text)=>inputHandler(text,key)}/>
          <TextInput placeholder={"Enter Name"} value={input.value}  onChangeText={(text)=>inputHandler(text,key)}/>
          <TouchableOpacity onPress = {()=> deleteHandler(key)}>
            <Button title='Cancel' style={{color: "red", fontSize: 13}} />
          </TouchableOpacity> 
        </View>
      ))}
      </ScrollView>
      <Button title="Add" onPress={addHandler} />
      
    </View>
  );*/
