import React, { useState } from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function PhoneInput({
    value,
    onChange,
    placeholder = "Enter phone number",
    inputStyle = { width: '100%' },
    country = "us",
    enableSearch = true,
    disableDropdown = false,
    // onlyCountries = ['us', 'ca'],
    preferredCountries = ['india'],
    ...props
}) {
    return (
        <ReactPhoneInput
            name={name}
            country={country}
            value={value}
            onChange={(phone) => onChange(phone)}  // onChange gives the phone string directly
            placeholder={placeholder}
            disableDropdown={disableDropdown}
            preferredCountries={preferredCountries}
            inputProps={{
                name: 'phone',
                required: true,
                autoFocus: true,
                ...props
            }}
            containerClass="w-full"
            inputClass="border rounded px-3 py-2 w-full"

        />
    );
}

export default PhoneInput;