import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Alert } from "../../../shared/components/ui/Alert";
import { Icon } from "../../../shared/components/ui/Icon";
import { Modal } from "../../../shared/components/ui/Modal";
import { useAuth } from "../../auth";
import { formatCOP, formatPhone } from "../../../shared/utils/format";
import { buyRecharge, RechargeError } from "../services/recharge.service";
import type { BuyRechargeResponse } from "../types/recharge.types";
import { getOperatorStyle } from "../utils/recharge-status";
import { useSuppliers } from "../hooks/useSuppliers";

interface BuyRechargeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (response: BuyRechargeResponse) => void;
}

interface FormValues {
  supplierId: string;
  cellPhone: string;
  amount: string;
}

type Step = 1 | 2;

const MIN_AMOUNT = 1000;
const MAX_AMOUNT = 100000;

const DEFAULT_VALUES: FormValues = { supplierId: "", cellPhone: "", amount: "" };

const FIELDS_FOR_STEP_1: (keyof FormValues)[] = ["supplierId", "cellPhone", "amount"];

function formatPhoneMask(digits: string): string {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
}

function formatAmountMask(digits: string): string {
  if (!digits) return "";
  return new Intl.NumberFormat("es-CO").format(parseInt(digits, 10));
}

function getFieldWrapperClasses({
  focused,
  hasError,
  isValid,
}: {
  focused: boolean;
  hasError: boolean;
  isValid: boolean;
}): string {
  if (focused) {
    return isValid
      ? "border-success bg-surface-base ring-2 ring-success/20"
      : "border-primary-container bg-surface-base ring-2 ring-primary-container/20";
  }
  return hasError ? "border-error" : "border-border-subtle";
}

export function BuyRechargeModal({ open, onClose, onSuccess }: BuyRechargeModalProps) {
  const { session } = useAuth();
  const token = session?.accessToken;
  const { suppliers, loading: loadingSuppliers, error: suppliersError } = useSuppliers(open);
  const [serverError, setServerError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>(1);
  const firstFieldRef = useRef<HTMLButtonElement | null>(null);
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  const supplierId = useWatch({ control, name: "supplierId" });
  const cellPhone = useWatch({ control, name: "cellPhone" });
  const amount = useWatch({ control, name: "amount" });

  const selectedSupplier = suppliers?.find((s) => s.id === supplierId) ?? null;
  const amountNumber = amount ? parseInt(amount, 10) : 0;

  useEffect(() => {
    if (open && suppliers && suppliers.length > 0 && !supplierId) {
      setValue("supplierId", suppliers[0].id, { shouldValidate: true });
    }
  }, [open, suppliers, supplierId, setValue]);

  const handleClose = useCallback(() => {
    reset(DEFAULT_VALUES);
    setServerError(null);
    setStep(1);
    idempotencyKeyRef.current = crypto.randomUUID();
    onClose();
  }, [reset, onClose]);

  const handleContinue = async () => {
    setServerError(null);
    const valid = await trigger(FIELDS_FOR_STEP_1);
    if (valid) setStep(2);
  };

  const handleBack = () => {
    setServerError(null);
    idempotencyKeyRef.current = crypto.randomUUID();
    setStep(1);
  };

  const onSubmit = async (values: FormValues) => {
    if (!token) return;
    setServerError(null);
    const supplier = suppliers?.find((s) => s.id === values.supplierId);
    if (!supplier) {
      setServerError("Selecciona un operador móvil válido.");
      setStep(1);
      return;
    }
    try {
      const response = await buyRecharge(
        token,
        {
          supplierId: supplier.id,
          supplierName: supplier.name,
          value: parseInt(values.amount, 10),
          cellPhone: values.cellPhone,
        },
        idempotencyKeyRef.current,
      );
      idempotencyKeyRef.current = crypto.randomUUID();
      reset(DEFAULT_VALUES);
      setStep(1);
      onSuccess(response);
    } catch (err) {
      setServerError(
        err instanceof RechargeError
          ? err.message
          : "No pudimos procesar la recarga. Intenta nuevamente en unos minutos.",
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      labelledBy="buy-recharge-title"
      dismissible={false}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col">
        <div className="flex items-start justify-between border-b border-border-subtle px-6 pb-4 pt-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-primary-container" aria-hidden="true" />
              <h2
                id="buy-recharge-title"
                className="text-headline-sm font-semibold tracking-tight text-text-primary"
              >
                {step === 1 ? "Nueva recarga móvil" : "Confirmar recarga"}
              </h2>
            </div>
            <p className="text-body-sm text-text-secondary">
              {step === 1
                ? "Ingresa el número celular y el valor a recargar"
                : "Revisa los datos antes de enviar la transacción al operador"}
            </p>
            <StepIndicator step={step} />
          </div>
          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={handleClose}
            className="cursor-pointer rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary-container"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          {step === 1 && (
            <>
              <OperatorField
                suppliers={suppliers}
                loading={loadingSuppliers}
                error={suppliersError}
                value={supplierId}
                onChange={(id) => setValue("supplierId", id, { shouldValidate: true })}
                registerProps={register("supplierId", {
                  required: "Selecciona un operador móvil.",
                })}
                errorMessage={errors.supplierId?.message}
                firstFieldRef={firstFieldRef}
              />

              <Controller
                control={control}
                name="cellPhone"
                rules={{
                  required: "Ingresa el número de celular.",
                  validate: (value) => {
                    if (value.length !== 10) return "El número debe tener 10 dígitos.";
                    if (!value.startsWith("3")) return "El número debe comenzar por 3.";
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <PhoneField
                    value={field.value}
                    onChange={(digits) => {
                      field.onChange(digits);
                      if (fieldState.error) void trigger("cellPhone");
                    }}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="amount"
                rules={{
                  required: "Ingresa el monto a recargar.",
                  validate: (value) => {
                    const num = parseInt(value, 10);
                    if (Number.isNaN(num)) return "Ingresa un monto válido.";
                    if (num < MIN_AMOUNT) return `El monto mínimo es ${formatCOP(MIN_AMOUNT)}.`;
                    if (num > MAX_AMOUNT) return `El monto máximo es ${formatCOP(MAX_AMOUNT)}.`;
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <AmountField
                    value={field.value}
                    onChange={(digits) => {
                      field.onChange(digits);
                      if (fieldState.error) void trigger("amount");
                    }}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </>
          )}

          {step === 2 && (
            <ConfirmationSummary
              supplierName={selectedSupplier?.name ?? "—"}
              cellPhone={cellPhone}
              amount={amountNumber}
              terminal={session?.user.name}
            />
          )}

          {serverError && (
            <Alert
              title="No se pudo procesar la recarga"
              message={serverError}
              onDismiss={() => setServerError(null)}
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border-subtle px-6 py-4">
          {step === 1 && (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="cursor-pointer rounded-lg border border-border-subtle bg-surface-base px-5 py-2.5 text-label-md font-medium text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary-container"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-container px-6 py-2.5 text-label-md font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
              >
                <span>Continuar</span>
                <Icon name="arrow_forward" size={18} />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-subtle bg-surface-base px-5 py-2.5 text-label-md font-medium text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary-container disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon name="arrow_back" size={18} />
                <span>Volver</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-container px-6 py-2.5 text-label-md font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {isSubmitting ? (
                  <>
                    <Icon name="sync" size={18} className="animate-spin" />
                    <span>Procesando…</span>
                  </>
                ) : (
                  <>
                    <Icon name="check_circle" size={18} />
                    <span>Confirmar recarga</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const items: { id: Step; label: string }[] = [
    { id: 1, label: "Datos" },
    { id: 2, label: "Confirmación" },
  ];

  return (
    <ol className="mt-1 flex items-center gap-2">
      {items.map((item, index) => {
        const isActive = step === item.id;
        const isDone = step > item.id;
        const circleClasses = isActive
          ? "bg-primary-container text-on-primary"
          : isDone
            ? "bg-success text-white"
            : "bg-surface-container text-text-secondary";
        return (
          <li key={item.id} className="flex items-center gap-2">
            <span
              className={`flex size-5 items-center justify-center rounded-full text-[11px] font-semibold ${circleClasses}`}
            >
              {isDone ? <Icon name="check" size={14} /> : item.id}
            </span>
            <span
              className={`text-caption font-semibold uppercase tracking-wider ${
                isActive ? "text-text-primary" : "text-text-secondary"
              }`}
            >
              {item.label}
            </span>
            {index < items.length - 1 && (
              <span className="h-px w-6 bg-border-subtle" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

interface OperatorFieldProps {
  suppliers: { id: string; name: string }[] | null;
  loading: boolean;
  error: string | null;
  value: string;
  onChange: (id: string) => void;
  registerProps: ReturnType<ReturnType<typeof useForm<FormValues>>["register"]>;
  errorMessage?: string;
  firstFieldRef: React.MutableRefObject<HTMLButtonElement | null>;
}

function OperatorField({
  suppliers,
  loading,
  error,
  value,
  onChange,
  registerProps,
  errorMessage,
  firstFieldRef,
}: OperatorFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1 text-label-sm font-semibold text-text-primary">
        Operador móvil <span className="text-error">*</span>
      </label>

      <input type="hidden" {...registerProps} value={value} readOnly />

      {loading && (
        <p className="rounded-lg border border-border-subtle bg-surface-subtle px-3 py-3 text-body-sm text-text-secondary">
          Cargando operadores…
        </p>
      )}

      {error && !loading && (
        <p className="rounded-lg border border-error/20 bg-error-surface px-3 py-2 text-body-sm text-error">
          {error}
        </p>
      )}

      {!loading && !error && suppliers && suppliers.length > 0 && (
        <div className="grid grid-cols-4 gap-2.5">
          {suppliers.map((supplier, index) => {
            const isSelected = supplier.id === value;
            const style = getOperatorStyle(supplier.name);
            return (
              <button
                key={supplier.id}
                ref={index === 0 ? firstFieldRef : undefined}
                type="button"
                onClick={() => onChange(supplier.id)}
                aria-pressed={isSelected}
                className={`relative flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-center transition-all focus-visible:outline-2 focus-visible:outline-primary-container ${
                  isSelected
                    ? "border-primary-container bg-primary-fixed/20"
                    : "border-border-subtle bg-surface-base hover:bg-surface-subtle"
                }`}
              >
                {isSelected && (
                  <Icon
                    name="check_circle"
                    size={16}
                    className="absolute right-1 top-1 text-primary-container"
                  />
                )}
                <div
                  className={`flex size-8 items-center justify-center rounded-full text-label-md font-bold ${style.badge}`}
                >
                  {supplier.name.charAt(0).toUpperCase()}
                </div>
                <span
                  className={`text-label-sm ${
                    isSelected ? "font-semibold text-text-primary" : "text-text-primary"
                  }`}
                >
                  {supplier.name}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {!loading && !error && suppliers && suppliers.length === 0 && (
        <p className="rounded-lg border border-border-subtle bg-surface-subtle px-3 py-2 text-body-sm text-text-secondary">
          No hay operadores disponibles.
        </p>
      )}

      {errorMessage && <p className="text-body-sm text-error">{errorMessage}</p>}
    </div>
  );
}

interface PhoneFieldProps {
  value: string;
  onChange: (digits: string) => void;
  onBlur: () => void;
  error?: string;
}

function PhoneField({ value, onChange, onBlur, error }: PhoneFieldProps) {
  const [focused, setFocused] = useState(false);
  const isValid = value.length === 10 && value.startsWith("3");
  const hasError = Boolean(error);
  const status: "neutral" | "valid" | "error" = hasError ? "error" : isValid ? "valid" : "neutral";

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="cellPhoneInput"
        className="flex items-center gap-1 text-label-sm font-semibold text-text-primary"
      >
        Número de celular <span className="text-error">*</span>
      </label>
      <div
        className={`relative flex items-center rounded-lg border bg-surface-subtle transition-all ${getFieldWrapperClasses(
          { focused, hasError, isValid },
        )}`}
      >
        <div className="flex w-16 shrink-0 select-none items-center justify-center rounded-l-lg border-r border-border-subtle bg-surface-container px-3 py-2.5">
          <span className="text-label-sm font-bold text-text-primary">+57</span>
        </div>
        <input
          id="cellPhoneInput"
          type="tel"
          inputMode="numeric"
          autoComplete="off"
          placeholder="300 000 0000"
          value={formatPhoneMask(value)}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
            onChange(digits);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          aria-invalid={hasError || undefined}
          className="w-full bg-transparent px-3 py-2.5 font-semibold tracking-wider text-label-md text-text-primary placeholder:text-text-secondary/50 focus:outline-none"
        />
        <div
          className={`pr-3 ${
            status === "valid"
              ? "text-success"
              : status === "error"
                ? "text-error"
                : "text-text-secondary"
          }`}
        >
          <Icon
            name={status === "valid" ? "check_circle" : status === "error" ? "error" : "pending"}
            size={20}
          />
        </div>
      </div>
      <div className="flex items-center justify-between px-0.5">
        <span
          className={`flex items-center gap-1 text-caption ${
            status === "error"
              ? "text-error"
              : status === "valid"
                ? "text-success"
                : "text-text-secondary"
          }`}
        >
          <Icon
            name={status === "error" ? "error" : status === "valid" ? "verified" : "info"}
            size={15}
          />
          {error ?? "El número debe comenzar por 3 y tener 10 dígitos."}
        </span>
        <span
          className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-medium ${
            status === "valid"
              ? "border-emerald-200 bg-success-surface text-success"
              : status === "error"
                ? "border-rose-200 bg-error-surface text-error"
                : "border-border-subtle bg-surface-subtle text-text-secondary"
          }`}
        >
          {value.length}/10 dígitos
        </span>
      </div>
    </div>
  );
}

interface AmountFieldProps {
  value: string;
  onChange: (digits: string) => void;
  onBlur: () => void;
  error?: string;
}

function AmountField({ value, onChange, onBlur, error }: AmountFieldProps) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);
  const amountNumber = value ? parseInt(value, 10) : NaN;
  const isValid =
    !Number.isNaN(amountNumber) && amountNumber >= MIN_AMOUNT && amountNumber <= MAX_AMOUNT;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="amountInput"
        className="flex items-center gap-1 text-label-sm font-semibold text-text-primary"
      >
        Monto de la recarga (COP) <span className="text-error">*</span>
      </label>
      <div
        className={`relative flex items-center rounded-lg border bg-surface-subtle transition-all ${getFieldWrapperClasses(
          { focused, hasError, isValid },
        )}`}
      >
        <div className="flex w-16 shrink-0 select-none items-center justify-center rounded-l-lg border-r border-border-subtle bg-surface-container px-3 py-2.5">
          <span className="text-label-md font-semibold text-text-primary">$</span>
        </div>
        <input
          id="amountInput"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="20.000"
          value={formatAmountMask(value)}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "").slice(0, 7);
            onChange(digits);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          aria-invalid={hasError || undefined}
          className="w-full bg-transparent px-3 py-2.5 text-right font-semibold tracking-wider text-label-md text-text-primary placeholder:text-text-secondary/50 focus:outline-none"
        />
        <div className="pointer-events-none flex items-center pl-1 pr-3 text-text-secondary">
          <span className="text-label-sm font-semibold">COP</span>
        </div>
      </div>
      <div className="flex items-center justify-between px-0.5">
        <span
          className={`flex items-center gap-1 text-caption ${
            hasError ? "text-error" : "text-text-secondary"
          }`}
        >
          <Icon
            name={hasError ? "error" : "info"}
            size={15}
            className={hasError ? "" : "text-tertiary"}
          />
          {error ?? `Mínimo ${formatCOP(MIN_AMOUNT)} — Máximo ${formatCOP(MAX_AMOUNT)}`}
        </span>
      </div>
    </div>
  );
}

interface SummaryProps {
  supplierName: string;
  cellPhone: string;
  amount: number;
  terminal?: string;
}

function ConfirmationSummary({ supplierName, cellPhone, amount, terminal }: SummaryProps) {
  const operatorStyle = getOperatorStyle(supplierName);
  const phonePreview = cellPhone.length === 10 ? formatPhone(cellPhone) : `+57 ${cellPhone}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-base">
        <div className="flex items-center justify-between border-b border-border-subtle bg-surface-subtle px-4 py-2.5">
          <span className="text-caption font-semibold uppercase tracking-wider text-text-secondary">
            Resumen de la recarga
          </span>
          {terminal && (
            <span className="text-caption font-medium text-text-secondary">{terminal}</span>
          )}
        </div>

        <div className="flex flex-col divide-y divide-border-subtle">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-body-sm text-text-secondary">Operador móvil</span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-label-sm font-semibold ${operatorStyle.badge}`}
            >
              <span className={`size-2 rounded-full ${operatorStyle.dot}`} aria-hidden="true" />
              {supplierName}
            </span>
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-body-sm text-text-secondary">Número de celular</span>
            <span className="font-mono text-label-md font-semibold text-text-primary">
              {phonePreview}
            </span>
          </div>

          <div className="flex items-center justify-between bg-primary-fixed/20 px-4 py-4">
            <span className="text-label-sm font-semibold text-text-primary">Monto</span>
            <span className="text-headline-md font-bold tracking-tight text-primary-container">
              {formatCOP(amount)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-info/20 bg-info-surface p-3.5">
        <Icon name="info" size={20} className="mt-0.5 text-info" />
        <div className="flex flex-col">
          <span className="text-label-sm font-semibold text-info">Antes de confirmar</span>
          <span className="text-body-sm text-text-secondary">
            Verifica el operador, número y monto.
          </span>
        </div>
      </div>
    </div>
  );
}
