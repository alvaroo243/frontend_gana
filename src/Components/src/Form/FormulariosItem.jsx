import { Form, Input } from 'antd';
import React from 'react';

export default function FormulariosItem({ label, name, value, setValue, disable = false, rules, Tipo=Input, style, placeholder, onChange, options,  addon, suffix, clase }) {
    if (onChange === undefined) {
        onChange = (newValue) => {
            if (Tipo === Input) {
                newValue = newValue.target.value;
            }
            setValue({ ...value, [name]: newValue });
        }
    }
    return (
        <Form.Item
            label={label}
            name={name}
            rules={rules}
            style = {style}
        >
            <Tipo 
                style={{minWidth: 315}}
                disabled={disable} 
                onChange={onChange} 
                
                options = {options}
                placeholder = {placeholder}
                addonAfter = {addon}
                suffix = {suffix}
            />
        </Form.Item>

    )
}
