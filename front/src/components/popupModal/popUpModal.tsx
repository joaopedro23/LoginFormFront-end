import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaLock, FaUser, FaUserCircle } from 'react-icons/fa';
import { z } from 'zod'
import { IoClose } from "react-icons/io5"
import './modalPop.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
}
type CreateUserDataFormDataModal = {
    userData:{
        username:string;  
        email: string;
        password: string;
    }
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const url = 'https://currency-78wflzg49-joaopedro23.vercel.app/registre'

const creatUserSchema = z.object({
    userData: z.object({
    username: z.string().min(3,"User é obrigatorio").max(15),
    email: z.string()
    .regex(emailRegex,{
    message: "E-mail é obrigatorio",})
    .toLowerCase(),
    password:z.string()
    .min(6,'A senha precisa de 6 caracteres')
    }),
    });

    


const CustomModal: React.FC<ModalProps> = ({ isOpen ,closeModal }) => {
    const [output, setOutput] = useState('')
    const [loading, setLoading] = useState(false)
    const { register,
        handleSubmit,
        formState: { errors } } 
        = useForm<CreateUserDataFormDataModal>({
        resolver: zodResolver(creatUserSchema)
})

        const navigate = useNavigate();
//envio de dados//
async function createUserRegistre(data: CreateUserDataFormDataModal) {
    console.log('Função createUser foi acionada!');
    try {
    console.log('Dados enviados:', data);
        const response = await axios.post(url, data);

        if (response.data && response.data.token) {
        const token = response.data.token;

        
        localStorage.setItem('DDD_101', token);

        setOutput(JSON.stringify(response.data, null, 2));

        const redirectTo = response.data.redirectTo;
        
        if (redirectTo === '/client') {
            navigate('/client');
            } else if (redirectTo === '/admin') {
            navigate('/admin'); 
                } 
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
            } else { 
            console.error('Token não encontrado na resposta do servidor');
            }
            } catch (error) {
            console.error('Erro ao enviar dados:', error);
            setOutput('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
            } finally{
            setLoading(false)
            }
        }
const onSubmit = (data: CreateUserDataFormDataModal) => {
    // Atualizar o estado 'output' com os dados submetidos
    setOutput(JSON.stringify(data, null, 2)); // Exemplo simples: transformando em string para exibir na tela
};

    return ( 
    <div className={`modal ${isOpen ? 'open' : ''}`}>
        <div className="modal-overlay" onClick={closeModal}></div>
        {isOpen && (
        <div className="modal-content">
            <div className="modal-popup">
                <div className="modal-content">
            
            <div className="modal-body">
            <h1>Sign Up </h1>
            
        <form  onSubmit={handleSubmit(createUserRegistre)}>

        <div className='form-group'>
            <label htmlFor="username">Name</label>
            <input type="username" className='form-control'
            {...register('userData.username')}
            />
            <FaUserCircle  className="icon"/>
        {errors.userData?.username && <span>{errors.userData?.username.message}</span>}
        </div>

        <div className='form-group'>
            <label htmlFor="email">E-mail</label>
            <input type="email" className='form-control'
            {...register('userData.email')}
            />
            <FaUser className="icon"/>
        {errors.userData?.email && <span>{errors.userData?.email.message}</span>}
        </div>
        
        <div className='form-group'>
            <label htmlFor="password">Senha</label>
            <input type="password" className='form-control'
            {...register('userData.password')} 
            />
            <FaLock className="icon"/>
            {errors.userData?.password && <span>{errors.userData?.password.message}</span>}
        </div>
        <button type="submit" className='login'>Login</button>
        <IoClose onClick={closeModal} className="close-button "/>
        </form>
        
        <div>{output}</div>       
        
        </div>
        </div>
        </div>
        </div>
        )}
    </div>
        
    );
};

export default CustomModal
