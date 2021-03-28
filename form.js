import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextInput, Button, View, Text, StyleSheet } from 'react-native';
import * as yup from 'yup';

const TextField = ({ error, label, ...inputProps }) => (
    <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={[styles.input, !!error && styles.borderError]}
            {...inputProps}
        />
        {!!error && <Text style={styles.errorMessage}>{error.message}</Text>}
    </View>
)

const fieldsValidationSchema = yup.object().shape({
    email: yup
        .string()
        .required('O email não pode ser vazio')
        .email('Digite um email válido'),
    height: yup
        .number()
        .required('A altura não pode ser vazia')
        .min(1, 'O altura deve ser maior que 0'),
    weight: yup
        .number()
        .required('A peso não pode ser vazia')
        .min(1, 'O peso deve ser maior que 0'),
    name: yup
        .string()
        .required('O nome não pode ser vazio')
})

export default function FormPeople(props) {
    const { register, setValue, handleSubmit, errors } = useForm({ validationSchema: fieldsValidationSchema });

    const onSubmit = (data) => {
        console.log(data);
        fetch('https://atividade21.herokuapp.com/people/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((json) => {
            console.log(json);
            props.getData();
            props.closeModal();
        })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        register('email');
        register('name');
        register('weight');
        register('height');
    }, [register])

    return (
        <View style={{}}>
            <TextField
                label={'Email'}
                placeholder={'Digite seu email'}
                error={errors?.email}
                onChangeText={text => setValue('email', text)}
            />
            <TextField
                label={'Nome'}
                placeholder={'Digite seu nome'}
                error={errors?.name}
                onChangeText={text => setValue('name', text)}
            />
            <TextField
                label={'Peso'}
                placeholder={'Digite seu peso'}
                error={errors?.weight}
                onChangeText={text => setValue('weight', text)}
                keyboardType="numeric"
            />
            <TextField
                label={'Altura'}
                placeholder={'Digite sua altura'}
                error={errors?.height}
                onChangeText={text => setValue('height', text)}
                keyboardType="numeric"
            />
            <Button onPress={handleSubmit(onSubmit)} title="Enviar" />
            <Button onPress={() => props.closeModal()} title="Cancelar" />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey'
    },
    input: {
        height: 40,
        fontSize: 16,
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        borderRadius: 8
    },
    label: {
        fontSize: 14,
        color: '#000',
        marginBottom: 4
    },
    container: {
        width: '80%',
        borderRadius: 10,
        marginBottom: 10
    },
    borderError: {
        borderWidth: 1,
        borderColor: 'rgba(200,0,50,1)'
    },
    errorMessage: {
        fontSize: 12,
        color: 'rgba(200,0,50,1)',
        textAlign: 'center',
        marginTop: 5
    }
})