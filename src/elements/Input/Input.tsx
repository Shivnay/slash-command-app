import React, { useEffect, useState } from 'react';
import Stylesheet from './Input.module.css';

interface InputProps {
    icon?: JSX.Element,
    type?: "text",
    defaultValue?: string,
    className?: string,
    onChange?: (value: string) => void,
    onBlur?: (value: string) => void,
    placeholder?: string,
    disabled?: boolean,
    required?: boolean
}

const Input = (props: InputProps) => {
    const [value, setValue] = useState("");
    useEffect(() => {
        if (props?.defaultValue && value !== props.defaultValue) 
            setValue(props.defaultValue || "") ;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.defaultValue]);
    const onChange = (value: string) => {
        setValue(value);
        if (props?.onChange) props.onChange(value);
    }
    return (
        <div className={Stylesheet.Container}>
            {props?.icon
            ? <h5 className={Stylesheet.Icon}>{props.icon}</h5>
            : null}
            <input type={props?.type || "text"}
            value={value}
            className={props?.className}
            onChange={event => onChange(event.target.value)}
            onBlur={event => props?.onBlur 
            && props?.onBlur(event.target.value)}
            placeholder={props?.placeholder || "enter value"}
            disabled={props?.disabled || false}
            required={props?.required || false} />
        </div>
    )
}

export default Input;