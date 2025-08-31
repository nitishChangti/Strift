import React from 'react';

function Input({
    type = 'text',
    placeholder = '',
    value,
    className = '',
    ...props
}, ref) {
    return (
        <div className='w-full'>
            <input
                ref={ref}
                type={type}
                onChange={props.onChange || (() => { })}
                placeholder={placeholder}
                value={value}
                className={`${className}`}
                {...props}
            />
        </div>
    );
}

export default React.forwardRef(Input);