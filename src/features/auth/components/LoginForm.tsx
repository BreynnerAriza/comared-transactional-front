import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";
import { Alert } from "../../../components/ui/Alert";
import { Button } from "../../../components/ui/Button";
import { Icon } from "../../../components/ui/Icon";
import { TextField } from "../../../components/ui/TextField";
import { AuthError, login } from "../services/auth.service";
import type { LoginCredentials } from "../types/auth.types";

export function LoginForm() {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginCredentials) => {
    setServerError(null);
    try {
      const session = await login({ ...values, email: values.email.trim() });
      signIn(session);
    } catch (err) {
      setServerError(
        err instanceof AuthError
          ? err.message
          : "No pudimos iniciar sesión. Intenta nuevamente en unos minutos.",
      );
    }
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          id="email"
          label="Correo electrónico"
          leadingIcon="mail"
          type="email"
          autoComplete="email"
<<<<<<< HEAD
          placeholder="usuario@gmail.com"
=======
          placeholder="usuario@comared.co"
>>>>>>> 9f061a29a35af34636430345815b816071f260b2
          autoFocus
          error={errors.email?.message}
          {...register("email", {
            required: "Ingresa tu correo electrónico.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Ingresa un correo electrónico válido.",
            },
            setValueAs: (value: string) => value.trim(),
          })}
        />

        <TextField
          id="password"
          label="Contraseña"
          leadingIcon="lock"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Ingresa tu contraseña"
          error={errors.password?.message}
          {...register("password", { required: "Ingresa tu contraseña." })}
          trailingAction={
            <button
              type="button"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((prev) => !prev)}
              className="flex size-8 cursor-pointer items-center justify-center rounded-md text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary-container"
            >
              <Icon name={showPassword ? "visibility_off" : "visibility"} />
            </button>
          }
        />

        <Button
          type="submit"
          loading={isSubmitting}
          loadingText="Autenticando nodo..."
          trailingIcon="arrow_forward"
        >
          Iniciar sesión
        </Button>

        {serverError && (
          <Alert
            title="Acceso denegado"
            message={serverError}
            onDismiss={() => setServerError(null)}
          />
        )}
      </form>
    </>
  );
}
