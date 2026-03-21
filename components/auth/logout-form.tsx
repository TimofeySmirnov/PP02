import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutForm() {
  return (
    <form action={logoutAction}>
      <Button className="w-full justify-center" type="submit" variant="secondary">
        Выйти
      </Button>
    </form>
  );
}
