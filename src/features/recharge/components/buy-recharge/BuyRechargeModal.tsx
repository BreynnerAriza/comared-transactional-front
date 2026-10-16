import { useCallback, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Alert } from "../../../../shared/components/ui/Alert";
import { Button } from "../../../../shared/components/ui/Button";
import { IconButton } from "../../../../shared/components/ui/IconButton";
import { Modal } from "../../../../shared/components/ui/Modal";
import { useAuth } from "../../../auth";
import { useSuppliers } from "../../hooks/useSuppliers";
import { buyRecharge, GENERIC_BUY_ERROR, RechargeError } from "../../services/recharge.service";
import type { BuyRechargeResponse } from "../../types/recharge.types";
import { validateAmount, validatePhone } from "../../utils/recharge-validation";
import { AmountField } from "./AmountField";
import { ConfirmationSummary } from "./ConfirmationSummary";
import { OperatorField } from "./OperatorField";
import { PhoneField } from "./PhoneField";
import { StepIndicator, type Step } from "./StepIndicator";

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

const DEFAULT_VALUES: FormValues = { supplierId: "", cellPhone: "", amount: "" };

export function BuyRechargeModal({ open, onClose, onSuccess }: BuyRechargeModalProps) {
  const { session } = useAuth();
  const token = session?.accessToken;
  const { suppliers, loading: loadingSuppliers, error: suppliersError } = useSuppliers(open);
  const [serverError, setServerError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("form");
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  const [supplierId, cellPhone, amount] = useWatch({
    control,
    name: ["supplierId", "cellPhone", "amount"],
  });
  const selectedSupplier = suppliers?.find((s) => s.id === supplierId) ?? null;

  useEffect(() => {
    if (open && suppliers && suppliers.length > 0 && !supplierId) {
      setValue("supplierId", suppliers[0].id, { shouldValidate: true });
    }
  }, [open, suppliers, supplierId, setValue]);

  const resetForm = useCallback(() => {
    reset(DEFAULT_VALUES);
    setServerError(null);
    setStep("form");
    setIdempotencyKey(crypto.randomUUID());
  }, [reset]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleContinue = async () => {
    setServerError(null);
    const valid = await trigger();
    if (valid) setStep("confirm");
  };

  const handleBack = () => {
    setServerError(null);
    setIdempotencyKey(crypto.randomUUID());
    setStep("form");
  };

  const onSubmit = async (values: FormValues) => {
    if (!token) return;
    setServerError(null);
    const supplier = suppliers?.find((s) => s.id === values.supplierId);
    if (!supplier) {
      setServerError("Selecciona un operador móvil válido.");
      setStep("form");
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
        idempotencyKey,
      );
      resetForm();
      onSuccess(response);
    } catch (err) {
      setServerError(err instanceof RechargeError ? err.message : GENERIC_BUY_ERROR);
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
                {step === "form" ? "Nueva recarga móvil" : "Confirmar recarga"}
              </h2>
            </div>
            <p className="text-body-sm text-text-secondary">
              {step === "form"
                ? "Ingresa el número celular y el valor a recargar"
                : "Revisa los datos antes de enviar la transacción al operador"}
            </p>
            <StepIndicator step={step} />
          </div>
          <IconButton icon="close" label="Cerrar modal" onClick={handleClose} />
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          {step === "form" && (
            <>
              <Controller
                control={control}
                name="supplierId"
                rules={{ required: "Selecciona un operador móvil." }}
                render={({ field, fieldState }) => (
                  <OperatorField
                    suppliers={suppliers}
                    loading={loadingSuppliers}
                    loadError={suppliersError}
                    value={field.value}
                    onChange={(id) => {
                      field.onChange(id);
                      if (fieldState.error) void trigger("supplierId");
                    }}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="cellPhone"
                rules={{ required: "Ingresa el número de celular.", validate: validatePhone }}
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
                rules={{ required: "Ingresa el monto a recargar.", validate: validateAmount }}
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

          {step === "confirm" && (
            <ConfirmationSummary
              supplierName={selectedSupplier?.name ?? "—"}
              cellPhone={cellPhone}
              amount={parseInt(amount, 10)}
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
          {step === "form" ? (
            <>
              <Button key="cancel" variant="secondary" fullWidth={false} onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                key="continue"
                fullWidth={false}
                trailingIcon="arrow_forward"
                onClick={handleContinue}
              >
                Continuar
              </Button>
            </>
          ) : (
            <>
              <Button
                key="back"
                variant="secondary"
                fullWidth={false}
                leadingIcon="arrow_back"
                disabled={isSubmitting}
                onClick={handleBack}
              >
                Volver
              </Button>
              <Button
                key="submit"
                type="submit"
                fullWidth={false}
                leadingIcon="check_circle"
                loading={isSubmitting}
                loadingText="Procesando…"
              >
                Confirmar recarga
              </Button>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
}
