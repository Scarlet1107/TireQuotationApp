import React, { useRef } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Wheel } from "@/utils/interface";

interface WheelInputCollapsibleProps {
  wheel: Wheel;
  setWheel: (wheel: Wheel) => void;
}

const WheelInputCollapsible = ({
  wheel,
  setWheel,
}: WheelInputCollapsibleProps) => {
  const wheelPriceInputRef = useRef<HTMLInputElement>(null);
  const wheelQuantityInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.select();
    }
  };

  return (
    <Collapsible
      open={wheel.isIncluded}
      onOpenChange={() => setWheel({ ...wheel, isIncluded: !wheel.isIncluded })}
    >
      <CollapsibleTrigger asChild>
        <div className="flex w-max items-center space-x-2">
          <Label>ホイール</Label>
          {wheel.isIncluded ? (
            <Checkbox checked={true} />
          ) : (
            <Checkbox checked={false} />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-6 flex flex-col space-y-4">
          <div className="flex w-max flex-col space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Input
              name="option"
              type="text"
              onChange={(e) => setWheel({ ...wheel, name: e.target.value })}
              value={wheel.name}
              placeholder="ホイール名"
            />
            <Input
              name="option"
              type="text"
              onChange={(e) => setWheel({ ...wheel, size: e.target.value })}
              value={wheel.size}
              placeholder="ホイールサイズ"
            />
          </div>
          <div className="flex w-max flex-col justify-start space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex items-end">
              <Label className="space-y-1">
                <span>金額</span>
                <Input
                  name="price"
                  type="number"
                  ref={wheelPriceInputRef}
                  onClick={() => handleClick(wheelPriceInputRef)}
                  step={100}
                  onChange={(e) =>
                    setWheel({ ...wheel, price: Number(e.target.value) })
                  }
                  value={wheel.price}
                  placeholder="金額"
                />
              </Label>
            </div>
            <div className="flex items-end">
              <Label className="space-y-1">
                <span>数量</span>
                <Input
                  name="quantity"
                  type="number"
                  ref={wheelQuantityInputRef}
                  onClick={() => handleClick(wheelQuantityInputRef)}
                  min={1}
                  onChange={(e) =>
                    setWheel({ ...wheel, quantity: Number(e.target.value) })
                  }
                  value={wheel.quantity}
                  placeholder="数量"
                />
              </Label>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default WheelInputCollapsible;
