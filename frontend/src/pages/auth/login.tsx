import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'


const signInForm = z.object({
  email: z.string().email(),
})

type SignInForm = z.infer<typeof signInForm>

export function Login() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignInForm>()

  async function handleSignIn(data: SignInForm) {
    console.log(data)
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  return (
    <div className="w-[540px] h-[660px] rounded-lg flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="w-full max-w-sm p-6 rounded-lg ">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

        <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700">Senha</label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha"
              required
            />
          </div>
          <div className="w-full flex items-center justify-center ">
            <Button disabled={isSubmitting} className="w-20 bg-blue-500 text-white" type="submit">
              Entrar 
            </Button>
          </div>
          
        </form>

        <div className="text-center mt-4">
          <a href="#" className="text-blue-500 hover:underline text-sm">Esqueceu a senha?</a>
        </div>

        <div className="text-center mt-4">
          <a href="#" className="text-blue-500 hover:underline text-sm">Primeiro acesso?</a>
        </div>
      </div>
    </div>
  );
}



