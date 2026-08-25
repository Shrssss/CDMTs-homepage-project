"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Card, CardContent } from "@/components/ui/card";
import { useInfiniteItems, useItemDetail } from "@/hooks/item";

const ItemDetail = ({ id }: { id: number }) => {
  const { data, isFetching } = useItemDetail({ id });
  if (isFetching) {
    return <Spinner />;
  }
  return (
    <div className="p-2">
      <div className="text-sm text-muted-foreground">{data?.description}</div>
      <div>保管場所：{data?.storageLocation}</div>
      {data?.isDisposable && <Badge>消耗品</Badge>}
      <div>{data?.isRentable && <Badge>貸出可能</Badge>}</div>
      <div>数量：{data?.quantity}</div>
    </div>
  );
};

const ItemsClient = () => {
  const [name, setName] = useQueryState("name");
  const [storageLocation, setStorageLocation] =
    useQueryState("storageLocation");
  const [isDisposable, setIsDisposable] = useQueryState(
    "isDisposable",
    parseAsBoolean.withDefault(false),
  );
  const [isRentable, setIsRentable] = useQueryState(
    "isRentable",
    parseAsBoolean.withDefault(false),
  );
  const { data, fetchNextPage, isFetchingNextPage, isFetched, hasNextPage } =
    useInfiniteItems({
      isDisposable,
      isRentable,
      name,
      storageLocation,
    });

  return (
    <div className="mx-auto max-w-6xl p-4">
      <Card>
        <CardContent>
          <form action="">
            <div className="flex flex-col gap-6">
              <div>
                <Label htmlFor="name">名前</Label>
                <Input
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  value={name ? name : ""}
                />
              </div>
              <div>
                <Label htmlFor="storageLocation">場所</Label>
                <Input
                  onChange={(e) => setStorageLocation(e.target.value)}
                  value={storageLocation ? storageLocation : ""}
                  id="storageLocation"
                />
              </div>
              <div className="flex gap-2">
                <Label htmlFor="isRentable">貸出可能</Label>
                <Checkbox
                  id="isRentable"
                  onCheckedChange={(c) => {
                    setIsRentable(c.toString() === "true");
                  }}
                  checked={isRentable}
                />
              </div>
              <div className="flex gap-2">
                <Label htmlFor="isDisposable">消耗品</Label>
                <Checkbox
                  id="isDisposable"
                  onCheckedChange={(c) => {
                    setIsDisposable(c.toString() === "true");
                  }}
                  checked={isDisposable}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-2 my-2">
        {data?.pages.flat(1).map((item, idx) => {
          return (
            <Item key={idx} className="" variant={"outline"}>
              <ItemContent>
                <div className="flex gap-1">
                  {item.isRentable ? (
                    <Badge>貸出可能</Badge>
                  ) : (
                    <Badge variant={"outline"}>貸出中</Badge>
                  )}
                  {item.isDisposable && <Badge>消耗品</Badge>}
                </div>
                <ItemTitle>
                  <h2 className="font-bold">{item.name}</h2>
                </ItemTitle>
                <ItemDescription>{item.storageLocation}</ItemDescription>
                <ItemActions>
                  <ButtonGroup>
                    <Button variant={"default"}>借りる</Button>
                    <Button variant={"destructive"}>削除する</Button>
                  </ButtonGroup>
                </ItemActions>
                <ItemDetail id={item.id} />
              </ItemContent>
            </Item>
          );
        })}
      </div>
      {hasNextPage ? (
        <Button
          onClick={() => {
            fetchNextPage();
          }}
          size={"icon"}
        >
          {isFetchingNextPage ? <Spinner /> : "+"}
        </Button>
      ) : (
        <div>
          {isFetched ? (
            <p className="text-xs text-muted-foreground">最後の備品です</p>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemsClient;
