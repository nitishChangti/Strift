import React, { useEffect, useState } from 'react';
import Input from '../Input';
import Button from '../Button';
import { useForm } from "react-hook-form"
import profile from '../../services/profile'
function ProfileInfo() {
    const data = {
        // "email": "webdeve25@gmail.com",
        // "firstName": "Web",
        // "gender": "male",
        // "lastName": "dev",
        // "phone": "+918217018130"
    }
    const [userData, setUserData] = useState(null);

    const { register, handleSubmit, formState, reset } = useForm()
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);

    useEffect(() => {
        profile.getUserProfile().then(response => {
            const data = response.data.user;
            console.log(data)
            setUserData(data);
            reset(data); // update form values
            console.log(userData)
        }
        ).catch(error =>
            console.error(error)
        );

    }, [])

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    }
    const handleEditOfEmail = () => {
        setIsEditingEmail(!isEditingEmail);
    }
    const handleEditOfMobile = () => {
        setIsEditingPhone(!isEditingPhone);
    }

    const isFormDirty = Object.keys(formState.dirtyFields).length > 0;
    const onSubmit = (data) => {
        const updatedData = {};
        for (const key in formState.dirtyFields) {
            updatedData[key] = data[key];
        }
        // call your API with updatedData
        console.log(updatedData)
        profile.updateUserProfile(updatedData).then(response => {
            console.log(response.data.email)
            // data = response.data
            reset({
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                phone: response.data.phone,
                gender: response.data.gender
            });
            console.log(userData)
        }
        ).catch(error =>
            console.error(error)
        );

    };
    const onCancel = () => {
        reset(userData);
        setIsEditing(false);
        setIsEditingEmail(false);
        setIsEditingPhone(false);
    };


    return (
        <div className="bg-white rounded shadow-sm p-6 w-full max-w-4xl mx-auto mt-6">
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Personal Information */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                    <button type='button' onClick={toggleEdit} className="text-blue-600 text-sm hover:underline">{isEditing ? "Cancel" : "Edit"}</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Input
                        type="text"
                        placeholder="First Name"
                        className="border p-2 rounded bg-gray-50 w-full"
                        readOnly={!isEditing}
                        {...register("firstName", {
                            required: true,
                        })}
                    />
                    <Input
                        type="text"
                        placeholder="Last Name"
                        className="border p-2 rounded bg-gray-50 w-full"
                        readOnly={!isEditing}
                        {...register("lastName", {
                            required: true,
                        })}
                    />
                </div>

                <div className="mb-6">
                    <p className="mb-2 font-semibold">Your Gender</p>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="gender" value="male" onClick={(e) => {
                                if (!isEditing) {
                                    e.preventDefault(); // prevent selection
                                }
                            }}
                                {
                                ...register("gender", {
                                    required: true,
                                })
                                }
                            />
                            Male
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="gender" value="female" onClick={(e) => {
                                if (!isEditing) {
                                    e.preventDefault(); // prevent selection
                                }
                            }}
                                {...register("gender", { required: true })}
                            />
                            Female
                        </label>
                        {/* {
                        isEditing ? (
                            <Button>Save</Button>
                            ) : null
                    } */}
                    </div>
                </div>

                {/* Email Address */}
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Email Address</h2>
                    <button type='button' className="text-blue-600 text-sm hover:underline" onClick={handleEditOfEmail} >{isEditingEmail ? "Cancel" : "Edit"}</button>
                </div>
                <Input
                    type="email"
                    placeholder="your.email@example.com"
                    className="border p-2 rounded bg-gray-50 w-full mb-6"
                    readOnly={!isEditingEmail}
                    {...register("email", {
                        required: true,
                    })}
                />
                {/* {
                isEditingEmail ? (
                    <Button>Save</Button>
                    ) : null
                    } */}
                {/* Mobile Number */}
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Mobile Number</h2>
                    <button type='button' className="text-blue-600 text-sm hover:underline" onClick={handleEditOfMobile}>{isEditingPhone ? "Cancel" : "Edit"}</button>
                </div>
                <Input
                    type="tel"
                    placeholder="+91XXXXXXXXXX"
                    className="border p-2 rounded bg-gray-50 w-full"
                    readOnly={!isEditingPhone}
                    {...register("phone", {
                        required: true,
                    })}
                />
                {/* {
                isEditingPhone ? (
                    <Button>Save</Button>
                    ) : null
                    } */}
                {
                    (isEditing || isEditingEmail || isEditingPhone) && (
                        <Button type="submit" disabled={!formState.isDirty} className='mt-5 w-25'>Save</Button>
                    )
                }

            </form>
        </div>
    );
}

export default ProfileInfo;