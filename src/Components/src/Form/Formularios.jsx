import { Button, Form, InputNumber, Modal, Select } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import FormulariosItem from './FormulariosItem';

export default function Formularios({titulo, id, actualizarTabla, setActualizarTabla}) {

  /// USESTATES ///

  const [open, setOpen] = useState(false);
  const [modalText, setModalText] = useState();
  const [apellidoDisabled, setApellidoDisabled] = useState(true);
  const [apellidoRequerido, setApellidoRequerido] = useState(false);
  const [classApellido, setClassApellido] = useState("");
  const [cpAddon, setCpAddon] = useState(" ");
  const [dniSuffix, setDniSuffix] = useState(" ");
  const [localidades, setLocalidades] = useState([]);
  const [selectHidden, setSelectHidden] = useState({display: "none"});
  const [contrato, setContrato] = useState({});
  
  const [form] = Form.useForm();

  /// USEEFFECTS ///

  useEffect(() => {
    if (contrato.documento !== undefined) {
      console.log("Change");
      handleChange();
    }
  }, [contrato.documento]);

  useEffect(() => {
    if (contrato.cp !== undefined) {
      console.log("Localidades");
      searchLocalidades();
    }
  }, [contrato.cp]);

  useEffect(() => {
    if (localidades.length > 0) {
      setSelectHidden({display: ""});
    } else {
      setSelectHidden({display: "none"});
    }
  }, [localidades]);

  /// MODAL ///

  const showModal = async () => {
    const response = await axios.get(`http://localhost:3000/getContract/${id}`);
    if (response.data !== null) {
      setContrato(response.data);
      form.setFieldsValue({...response.data});
    } else {
      form.setFieldValue({...contrato});
    }
    setOpen(true);
    setModalText(`${ titulo} Contrato`);
    console.log();
  };

  const handleOk = async () => {
    console.log("OK");
    setOpen(false);
    console.log(modalText);
    if (titulo === "Nuevo") {
      await axios.post("http://localhost:3000/addContract", contrato);
    } else {
      await axios.put("http://localhost:3000/modifyContract", contrato);
    }
    setContrato({});
    console.log("Contrato", contrato);
    setDniSuffix(" ");
    setCpAddon(" ");
    setApellidoDisabled(true);
    setContrato({ ...contrato, "apellido1": undefined, "apellido2": undefined });
    setApellidoRequerido(false);
    setSelectHidden({display: "none"});
    form.resetFields();
    setActualizarTabla(!actualizarTabla);
    
  };

  const handleCancel = () => {
    console.log('Solicitud cancelada');
    setOpen(false);
    setContrato({});
    setDniSuffix(" ");
    setCpAddon(" ");
    setApellidoDisabled(true);
    setContrato({ ...contrato, "apellido1": undefined, "apellido2": undefined });
    setApellidoRequerido(false);
    setSelectHidden({display: "none"});
    form.resetFields();
    resetErrores();
  };


  /// FORMULARIOS ///

  const onFinish = () => {
    if (validador()) {
      console.log(contrato);
      handleOk(); 
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log(id);
    console.log('Form Failed:', errorInfo);
  };

  const handleChange = () => {
    const value = contrato.documento;
    if (validateDNI(value)) {
      // setClassApellido([{required: true, message:"¡Rellene el campo Apellido1!"}]);
      setApellidoDisabled(false);
      setApellidoRequerido(true);
    } else {
      // setClassApellido("");
      setApellidoDisabled(true);
      setContrato({ ...contrato, "apellido1": undefined, "apellido2": undefined });
      setApellidoRequerido(false);
    }
  }

  // VALIDATORS ///

  const validateDNI = (dni) => {
    var numero, letra, letraDni;
    var expresion_regular_dni = /^[XYZ]?\d{5,8}[A-Z]$/;

    dni = dni.toUpperCase();

    if (expresion_regular_dni.test(dni) === true) {
      numero = dni.substr(0, dni.length - 1);
      numero = numero.replace('X', 0);
      numero = numero.replace('Y', 1);
      numero = numero.replace('Z', 2);
      letra = dni.substr(dni.length - 1, 1);
      numero = numero % 23;
      letraDni = 'TRWAGMYFPDXBNJZSQVHLCKET';
      letraDni = letraDni.substring(numero, numero + 1);
      if (letraDni !== letra) {
        // DNI erroneo
        setDniSuffix(" ");
        return false;
      } else {
        // DNI correcto
        setDniSuffix("DNI");
        return true;
      }
    } else {
      if (validateCIF(dni)) {
        // CIF correcto
        setDniSuffix("CIF");
        return false;
      }
      // Incorrecto
      setDniSuffix(" ");
      return false;
    }
  }

  const validateCIF = (cif) => {
      if (!cif || cif.length !== 9) {
        return false;
      }
    
      var letters = ['J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      var digits = cif.substr(1, cif.length - 2);
      var letter = cif.substr(0, 1);
      var control = cif.substr(cif.length - 1);
      var sum = 0;
      var i;
      var digit;
    
      if (!letter.match(/[A-Z]/)) {
        return false;
      }
    
      for (i = 0; i < digits.length; ++i) {
        digit = parseInt(digits[i]);
    
        if (isNaN(digit)) {
          return false;
        }
    
        if (i % 2 === 0) {
          digit *= 2;
          if (digit > 9) {
            digit = parseInt(digit / 10) + (digit % 10);
          }
    
          sum += digit;
        } else {
          sum += digit;
        }
      }
    
      sum %= 10;
      if (sum !== 0) {
        digit = 10 - sum;
      } else {
        digit = sum;
      }
    
      if (letter.match(/[ABEH]/)) {
        return String(digit) === control;
      }
      if (letter.match(/[NPQRSW]/)) {
        return letters[digit] === control;
      }
    
      return String(digit) === control || letters[digit] === control;
    
    }

    const validador = () => {
      const errores = document.getElementsByClassName('errores');
      resetErrores();
      if (contrato.nombre === "" || !contrato.nombre ) {
        errores[0].innerHTML = "¡Rellene el campo Nombre!";
      }
      if (apellidoRequerido) {
        if (contrato.apellido1 === "" || !contrato.apellido1) {
          errores[1].innerHTML = "¡Rellene el campo Apellido1!";
        }
      }
      if (contrato.documento === "" || !contrato.documento ) {
        errores[2].innerHTML = "¡Rellene el campo Documento!";
      } else {
        if (!validateDNI(contrato.documento) && dniSuffix === " ") {
          errores[2].innerHTML = "¡Documento no valido!";
        }
      }
      if (contrato.cp === "" || !contrato.cp) {
        errores[3].innerHTML = "¡Rellene el campo Codigo Postal!"; 
      } else {
        if (contrato.localidad === "" || !contrato.localidad) {
          errores[4].innerHTML = "¡No hay ninguna localidad!";
        }
      }
      if (contrato.telefono === "" || !contrato.telefono) {
        errores[5].innerHTML = "¡Rellene el campo Telefono!";
      } else {
        const regExp = new RegExp("^(\\+34|0034|34)?[6789]\\d{8}$");
        if (!regExp.test(contrato.telefono)) {
          errores[5].innerHTML = "¡Telefono no valido!";
        }
      }
      // if (!validateDNI(contrato.documento) && dniSuffix === " ") {
      //   errores[0].innerHTML = "¡Documento no valido!";
      // }
      // if (contrato.localidad === "" || !contrato.localidad) {
      //   errores[1].innerHTML = "¡No hay ninguna localidad!";
      // }
      for (let i = 0; i < errores.length; i++) {
        if (errores[i].innerHTML !== "") {
          return false;
        }
      }
      return true;
    }

    const resetErrores = () => {
      const errores = document.getElementsByClassName('errores');
      for (let i = 0; i < errores.length; i++) {
        errores[i].innerHTML = "";
      }
    }

    /// LOCALIDADES ///

  const searchLocalidades = async () => {
    const response = await axios.get(`http://localhost:3000/getLocalidad/${contrato.cp}`);
    if (response.data.length > 0) {
      if (response.data.length > 1) {
        setCpAddon(" ");
        const datos = response.data;
        const array = [];
        for (let i = 0; i < datos.length; i++) {
          array.push({value: datos[i].municipio_nombre, label: datos[i].municipio_nombre});
        }
        setLocalidades(array);
      } else {
        setContrato({ ...contrato, "localidad": response.data[0].municipio_nombre });
        setCpAddon(response.data[0].municipio_nombre);
        setLocalidades([]);
      }
    } else {
      setCpAddon("¡Incorrecto!");
      setContrato({ ...contrato, "localidad": undefined });
      setLocalidades([]);
    }
  }

  const elegirLocalidad = (value) => {
    contrato.localidad = value;
    setCpAddon(value);
  }


  /// RETURN ///

  return (
    <>
      <Button type="primary" onClick={showModal}>
        {titulo}
      </Button>
      <Modal
        title={modalText}
        open={open}
        onCancel={handleCancel}
        footer={[
        
          <>
            <Button key="back" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button form='form' type="primary" htmlType="submit" key="submit" >
              Enviar
            </Button>
          </>

        ]}

      >
        <Form
          form={form}
          id='form'
          name="form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >

          <FormulariosItem 
            label={"Nombre"} 
            name={"nombre"} 
            setValue={setContrato} 
            value={contrato} 
            // rules={[{required: true, message: "¡Rellene el campo Nombre!"}]}
          />
          <p className='errores'></p>
          <FormulariosItem 
            label={"Apellido1"} 
            name={"apellido1"} 
            setValue={setContrato} 
            value={contrato} 
            disable={apellidoDisabled} 
            rules = {classApellido}
          />
          <p className='errores'></p>
          <FormulariosItem 
            label={"Apellido2"} 
            name={"apellido2"} 
            setValue={setContrato}
            value={contrato} 
            disable={apellidoDisabled} 
          />
          <FormulariosItem 
            label={"Documento"} 
            name={"documento"} 
            setValue={setContrato} 
            value={contrato} 
            suffix = {dniSuffix}
            // rules={[{required: true, message: "¡Rellene el campo Documento!"}]}
          />
          <p className='errores'></p>
          <FormulariosItem 
            label={"Codigo Postal"} 
            name={"cp"} 
            setValue={setContrato} 
            value={contrato} 
            Tipo={InputNumber} 
            addon={cpAddon} 
            // rules={[{required: true, message: "¡Rellene el campo Codigo Postal!"}]}
          /> 
          <p className='errores'></p>
          <FormulariosItem 
            style={selectHidden} 
            label = {"Elige una localidad"} 
            placeholder = {"Localidad"} 
            onChange = {elegirLocalidad} 
            options = {localidades} 
            Tipo = {Select}
          />
          <p className='errores'></p>
          <FormulariosItem 
            label={"Dirección"} 
            name={"direccion"} 
            setValue={setContrato} 
            value={contrato} 
          />
          <FormulariosItem 
            label={"Teléfono"} 
            name={"telefono"} 
            setValue={setContrato} 
            value={contrato} 
            // rules={[{required: true, message: "¡Rellene el campo Telefono!"}, {pattern: new RegExp("^(\\+34|0034|34)?[6789]\\d{8}$"), message: "¡Telefono no valido!"}]}
          />
          <p className='errores'></p>
        </Form>
      </Modal>
    </>
  );
};