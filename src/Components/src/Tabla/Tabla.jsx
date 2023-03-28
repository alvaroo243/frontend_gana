import React, { useEffect, useState } from 'react';
import { Table, Button } from "antd";
import axios from "axios";
import Formularios from '../Form/Formularios';


export default function Tabla({actualizarTabla, setActualizarTabla}) {

    const [dataSource, setDataSource] = useState([]);
    
    

    const borrar = async (id) => {
        await axios.delete(`http://localhost:3000/deleteContract/${id}`);
        setActualizarTabla(!actualizarTabla);
    }

    const contratos = async () => {
        const response = await axios.get("http://localhost:3000/listContracts");
        if (response.statusText === "OK") {
            console.log("Lista de Contratos recogida");
        }
        return response.data;
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Documento',
            dataIndex: 'documento',
            key: 'documento',
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (elemento) => {         
                return (
                    <>
                        <Formularios titulo="Editar" id={elemento._id} actualizarTabla= {actualizarTabla} setActualizarTabla={setActualizarTabla} />
                        <Button type="primary" danger onClick={()=>{ borrar(elemento._id) }}>Borrar</Button>
                    </>
                );
            }
        }
    ];

    

    const getDataSource = async () => {
        const data = await contratos();
        if (data) setDataSource(data);
        console.log("Tabla actualizada");
    };
    useEffect(() => {
        getDataSource();
    }, [actualizarTabla]);

    return (
        <>
            <div>
                <Table  dataSource={dataSource.map((dato, index) => {
                    return {...dato, key: index}
                })} columns={columns} />
            </div>
        </>
    )
}
