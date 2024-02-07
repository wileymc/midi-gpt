import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { TextInput } from "@tremor/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export function Auth({
  handleClose,
  protectedChildren,
}: {
  handleClose: () => void;
  protectedChildren?: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  console.log(user);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "/",
      },
    });
    if (error) {
      toast.error(error.message);
    }

    if (data) {
      handleClose();
      toast.success("Welcome to MIDIgpt!");
      router.reload();
    }
  };

  if (!user)
    return (
      <form className="mt-4" onSubmit={handleSubmit}>
        <section className="space-y-4">
          <TextInput
            type="email"
            name="email"
            placeholder="Email"
            required
            autoComplete="email"
          />
          <TextInput
            type="password"
            name="password"
            placeholder="Password"
            required
            autoComplete="current-password"
          />
          <button className="btn-primary w-full" type="submit">
            Register
          </button>
          <small>
            Already have an account?{" "}
            <a href="#" className="text-teal-600 hover:underline">
              Sign in
            </a>
          </small>
        </section>
      </form>
    );

  return <p>You signed in!</p>;
}
