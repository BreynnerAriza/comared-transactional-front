import { Icon } from "../../../shared/components/ui/Icon";
import { AuthShowcase } from "../components/AuthShowcase";
import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="mx-auto my-auto flex min-h-180 w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-surface-base shadow-xl lg:flex-row">
        <section className="relative flex w-full flex-col justify-between bg-surface-base p-6 sm:p-8 lg:w-1/2 lg:p-12">
          <div className="flex flex-1 flex-col justify-center">
            <header className="mb-10 space-y-2">
              <h1 className="text-headline-lg text-text-primary">Bienvenido a Comared</h1>
              <p className="text-body-lg text-text-secondary">
                Ingresa a tu portal transaccional de operaciones
              </p>
            </header>
            <LoginForm />
          </div>
          <footer className="mt-10 border-t border-border-subtle pt-6">
            <p className="flex items-center gap-2 text-caption text-text-secondary">
              <Icon name="verified_user" size={16} className="text-success" />
              Red transaccional ComaRed Colombia
            </p>
          </footer>
        </section>
        <AuthShowcase />
      </div>
    </main>
  );
}
