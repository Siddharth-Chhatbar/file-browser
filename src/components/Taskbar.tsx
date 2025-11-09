import { Card, CardContent } from "./ui/card";

function Taskbar() {
  return (
    <Card className="rounded-none p-0 h-6">
      <CardContent className="p-0 px-2 text-[14px] flex items-center">
        <p>Card Content</p>
      </CardContent>
    </Card>
  );
}

export default Taskbar;
