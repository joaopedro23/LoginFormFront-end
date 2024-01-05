import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import './app.form.css'
import CustomModal from "../components/popupModal/popUpModal"

type CreateUserDataFormData = {
  userData:{
    email: string;
    password: string
  }
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const url = 'https://currency-78wflzg49-joaopedro23.vercel.app/login'

const creatUserSchema = z.object({
  userData: z.object({
  email: z.string()
  .regex(emailRegex,{
    message: "E-mail é obrigatorio",})
  .toLowerCase(),
  password:z.string()
  .min(6,'A senha precisa de 6 caracteres')
}),
});



export default function AppForm() {
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const { register,
          handleSubmit,
          formState: { errors } } 
          = useForm<CreateUserDataFormData>({
    resolver: zodResolver(creatUserSchema)
  })

                // popUpModal //
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => {
    setModalIsOpen(true)
  }
  const closeModal = () => {
    setModalIsOpen(false)
  }

                // fim da popUpModal //

  const navigate = useNavigate();
  async function createUser(data: CreateUserDataFormData) {
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
  
  return (
    <main>
      <div className="wrapper">
      <form onSubmit={handleSubmit(createUser)}>
        <h1>Login</h1>
          <div className="input-box">
            <label htmlFor="email">E-mail</label>
            <input type="email" 
            {...register('userData.email')}
            />
            <FaUser className="icon"/>
          {errors.userData?.email && <span>{errors.userData?.email.message}</span>}
          </div>

        <div className="input-box">
          <label htmlFor="password">Senha</label>
          <input type="password" 
          {...register('userData.password')} 
          />
          <FaLock className="icon"/>
          {errors.userData?.password && <span>{errors.userData?.password.message}</span>}
        </div>

        <div className="remember-forgot">
          <label><input type="checkbox"/>Lembra-Senha</label>
          <a href="#">esqueceu a senha?</a>
        </div>

        <button type="submit" >Login</button>
        <div className="register-link">
          <p>Nao tenho uma conta ainda?<a onClick={openModal}> Registra</a></p>
        </div>
      </form>
      <CustomModal isOpen={modalIsOpen} closeModal={closeModal} />
    </div>
  </main>  
    
  )
}
