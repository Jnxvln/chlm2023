import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { classNames } from 'primereact/utils'
import styles from '../../styles/user/Register.module.css'
// PrimeReact Components
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import Spinner from '../../components/layout/Spinner'
// Store data
import { fetchUser, register } from '../../api/users/usersApi'
import { useQueryClient, useMutation } from '@tanstack/react-query'
// import { register, reset } from "../../features/auth/authSlice";

function Register() {
    // #region VARS ----------------------------------------------
    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const { firstName, lastName, email, password, confirmPassword } = formData

    const navigate = useNavigate()

    const mutationRegisterUser = useMutation({
        mutationKey: ['user'],
        mutationFn: () => register(formData),
        onSuccess: (user) => {
            if (user) {
                formik.resetForm()
                queryClient.invalidateQueries(['user'])
                navigate('/dashboard')
                toast.success(`${user.firstName} ${user.lastName} registered`, {
                    autoClose: 3000,
                })
            }
        },
        onError: (err) => {
            const errMsg = 'Error registering user'
            console.log(errMsg)
            console.log(err)

            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                toast.error(err.response.data.message, { autoClose: 8000 })
            } else {
                toast.error(errMsg, { autoClose: 8000 })
            }
        },
    })

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate: (data) => {
            let errors = {}

            if (!data.firstName) {
                errors.firstName = 'First name is required'
            }

            if (!data.lastName) {
                errors.lastName = 'Last name is required'
            }

            if (!data.email) {
                errors.email = 'E-mail is required'
            }

            if (!data.password) {
                errors.password = 'Password is required'
            }

            if (!data.confirmPassword) {
                errors.confirmPassword = 'Confirm password is required'
            }

            if (data.password !== data.confirmPassword) {
                errors.password = 'Passwords do not match'
                errors.confirmPassword = 'Passwords do not match'
            }

            return errors
        },
        onSubmit: (data) => {
            setFormData(data)
            mutationRegisterUser.mutate(data)
        },
    })

    const isFormFieldValid = (name) =>
        !!(formik.touched[name] && formik.errors[name])
    const getFormErrorMessage = (name) => {
        return (
            isFormFieldValid(name) && (
                <small className="p-error">{formik.errors[name]}</small>
            )
        )
    }

    // #endregion

    return (
        <section>
            <form
                className={styles.registerForm}
                onSubmit={formik.handleSubmit}
            >
                <h1>Register User</h1>

                <div className="formgrid grid">
                    {/* First Name */}
                    <div className="field col-6">
                        <span className="p-float-label">
                            <InputText
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                className={classNames({
                                    'p-invalid': isFormFieldValid('firstName'),
                                })}
                                style={{ width: '100%' }}
                                autoFocus
                            />

                            <label
                                htmlFor="firstName"
                                className={classNames({
                                    'p-error': isFormFieldValid('firstName'),
                                })}
                            >
                                First Name *
                            </label>
                        </span>
                        {getFormErrorMessage('firstName')}
                    </div>

                    {/* Last Name */}
                    <div className="field col-6">
                        <span className="p-float-label">
                            <InputText
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                className={classNames({
                                    'p-invalid': isFormFieldValid('lastName'),
                                })}
                                style={{ width: '100%' }}
                            />
                            <label
                                htmlFor="lastName"
                                className={classNames({
                                    'p-error': isFormFieldValid('lastName'),
                                })}
                            >
                                Last Name *
                            </label>
                        </span>
                        {getFormErrorMessage('lastName')}
                    </div>

                    {/* Email */}
                    <div className="field col-12">
                        <span className="p-float-label">
                            <InputText
                                type="email"
                                id="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                className={classNames({
                                    'p-invalid': isFormFieldValid('email'),
                                })}
                                style={{ width: '100%' }}
                            />
                            <label
                                htmlFor="email"
                                className={classNames({
                                    'p-error': isFormFieldValid('email'),
                                })}
                            >
                                E-mail *
                            </label>
                        </span>
                        {getFormErrorMessage('email')}
                    </div>

                    {/* Password */}
                    <div className="field col-6">
                        <span className="p-float-label">
                            <Password
                                id="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                className={classNames({
                                    'p-invalid': isFormFieldValid('password'),
                                })}
                                toggleMask
                            />
                            <label
                                htmlFor="password"
                                className={classNames({
                                    'p-error': isFormFieldValid('password'),
                                })}
                            >
                                Password *
                            </label>
                        </span>
                        {getFormErrorMessage('password')}
                    </div>

                    {/* Confirm Password */}
                    <div className="field col-6">
                        <span className="p-float-label">
                            <Password
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                toggleMask
                                className={classNames({
                                    'p-invalid':
                                        isFormFieldValid('confirmPassword'),
                                })}
                            />
                            <label
                                htmlFor="confirmPassword"
                                className={classNames({
                                    'p-error':
                                        isFormFieldValid('confirmPassword'),
                                })}
                            >
                                Confirm Password *
                            </label>
                            {getFormErrorMessage('confirmPassword')}
                        </span>
                    </div>

                    {/* Submit Button */}
                    <div className="field col-12">
                        <Button
                            type="submit"
                            label="Register"
                            icon="pi pi-user-plus"
                            iconPos="left"
                        />
                    </div>
                </div>
            </form>
        </section>
    )
}

export default Register
