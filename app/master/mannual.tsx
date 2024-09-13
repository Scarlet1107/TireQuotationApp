import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const ManualComponent = () => {
  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-3xl font-bold">このページのマニュアル</h1>
        <Card className="mb-4">
          <CardHeader>
            <h2 className="text-2xl font-bold">はじめに</h2>
          </CardHeader>
          <CardContent>
            <p>このマニュアルでは、このページの基本的な使い方を説明します。</p>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <h2 className="text-2xl font-bold">更新が必要なデータ</h2>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-decimal">
              <li>tirePrice表　（A表）</li>
              <li>CustomerTypePriceRate表　（対A表）</li>
              <li>ServiceFees_rows表　（工賃表）</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <h2 className="text-2xl font-bold">データのアップロード方法</h2>
          </CardHeader>
          <CardContent>
            <ol className="list-inside list-decimal">
              <li>
                アップロードしたい表の「テンプレートを取得」ボタンをクリック
              </li>
              <li>ダウンロードされたテンプレートに対応したデータを入力</li>
              <li>テンプレートファイルをインストールしたものをアップロード</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManualComponent;
