"use client";

import { controlClass, FormDialog } from "@/components/admin/AdminParts";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCurrentMemberId } from "@/hooks/member";
import { errorMessage } from "@/lib/features/api";
import { updatePassword } from "@/lib/features/member";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

type Form = { oldPassword: string; newPassword: string; confirm: string };
type Errors = Partial<Record<keyof Form, string>>;

const BLANK: Form = { oldPassword: "", newPassword: "", confirm: "" };

const validate = (form: Form) => {
  const errors: Errors = {};
  if (!form.oldPassword) errors.oldPassword = "現在のパスワードを入力してください";
  if (form.newPassword.length < 10 || form.newPassword.length > 72)
    errors.newPassword = "10〜72文字で入力してください";
  if (form.confirm !== form.newPassword) errors.confirm = "新しいパスワードと一致しません";
  return errors;
};

// ログイン中のメンバーのパスワード変更
const PasswordDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const me = useCurrentMemberId();
  const [form, setForm] = useState<Form>(BLANK);
  const [errors, setErrors] = useState<Errors>({});

  // 閉じるときに入力を空にする（次に開いたとき前の入力が残らないように）
  const close = () => {
    setForm(BLANK);
    setErrors({});
    onOpenChange(false);
  };

  const save = useMutation({
    mutationFn: async (f: Form) => {
      if (me.data === undefined) throw new Error("ログイン中のメンバーが分かりません");
      await updatePassword({ id: me.data, oldPassword: f.oldPassword, newPassword: f.newPassword });
    },
    onSuccess: () => {
      close();
      toast.success("パスワードを変更しました");
    },
    onError: (e) => {
      toast.error(errorMessage(e, "変更できませんでした。もう一度お試しください。"));
    },
  });

  const field = (key: keyof Form, label: string, autoComplete: string, description?: string) => (
    <Field className="gap-1.5" data-invalid={!!errors[key]}>
      <FieldLabel htmlFor={`pw-${key}`}>{label}</FieldLabel>
      <Input
        id={`pw-${key}`}
        type="password"
        autoComplete={autoComplete}
        className={controlClass}
        aria-invalid={!!errors[key]}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
      {errors[key] ? (
        <FieldError className="text-xs">{errors[key]}</FieldError>
      ) : (
        description && <FieldDescription className="text-xs">{description}</FieldDescription>
      )}
    </Field>
  );

  return (
    <FormDialog
      open={open}
      onOpenChange={(o) => (o ? onOpenChange(true) : close())}
      title="パスワードを変更"
      description="現在のパスワードと新しいパスワードを入力してください。"
      submitLabel="変更する"
      isPending={save.isPending}
      onSubmit={() => {
        const errs = validate(form);
        setErrors(errs);
        if (Object.keys(errs).length === 0) save.mutate(form);
      }}
    >
      {field("oldPassword", "現在のパスワード", "current-password")}
      {field("newPassword", "新しいパスワード", "new-password", "10〜72文字")}
      {field("confirm", "新しいパスワード（確認）", "new-password")}
    </FormDialog>
  );
};

export default PasswordDialog;
