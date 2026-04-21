import React from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function PhoneInput({
    value,
    onChange,
    name = "phone",
    placeholder = "Enter phone number",
    country = "us",
    enableSearch = true,
    disableDropdown = false,
    preferredCountries = ['india'],
    ...props
}) {
    return (
        <ReactPhoneInput
            name={name}
            country={country}
            value={value}
            onChange={(phone) => onChange(phone)}
            placeholder={placeholder}
            enableSearch={enableSearch}
            disableDropdown={disableDropdown}
            preferredCountries={preferredCountries}
            inputProps={{
                name,
                required: true,
                autoFocus: true,
                className: "!w-full !h-12 !border !border-gray-300 !rounded !px-3 !py-2 focus:!outline-none focus:!border-black focus:!ring-1 focus:!ring-black",
                ...props
            }}
            containerClass="!w-full"
            buttonClass="!h-12 !px-2"
            dropdownClass="!rounded !shadow-md"
        />
    );
}

export default PhoneInput;
