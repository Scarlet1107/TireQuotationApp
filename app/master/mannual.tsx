import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";

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
            <h3>入力例</h3>
            <ul className="list-inside list-disc">
              <li>tirePrice表　（A表）</li>
              <li>CustomerTypePriceRate表　（対A表）</li>
              <li>ServiceFees_rows表　（工賃表）</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <h2 className="text-2xl font-bold">注意点</h2>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc">
              <li>
                csvファイルを保存する際は、データ形式をcsv UTF-8に指定して保存
              </li>
              <li>
                idのみ行は作らない
                idのみしか入力されていない行があるとエラーになる
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <h2 className="text-2xl font-bold">tirePrice表</h2>
          </CardHeader>
          <CardContent>
            <h3>入力例</h3>
            <Image
              src="/tirePrice.png" // publicディレクトリにある画像へのパス
              alt="My Image" // 画像の説明（アクセシビリティ用）
              width={1000} // 画像の幅（ピクセル単位）
              height={600} // 画像の高さ（ピクセル単位）
            />
            <ul className="list-inside list-disc">
              <li>
                laborCostRank：タイヤのサイズによる工賃のランク（Aが一番工賃が安い）
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <h2 className="text-2xl font-bold">ServiceFees表</h2>
          </CardHeader>
          <CardContent>
            <h3>入力例</h3>
            <Image
              src="/ServiceFees.png" // publicディレクトリにある画像へのパス
              alt="My Image" // 画像の説明（アクセシビリティ用）
              width={1000} // 画像の幅（ピクセル単位）
              height={600} // 画像の高さ（ピクセル単位）
            />

            <ul className="list-inside list-disc">
              <li>laborFee：タイヤ取り付け工賃</li>
              <li>removalFee：タイヤ取り外し工賃</li>
              <li>tireDisposalFee：タイヤ処分費用</li>
              <li>tireStorageFee ：タイヤ保管費用</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <h2 className="text-2xl font-bold">CustomTypePriceRate表</h2>
          </CardHeader>
          <CardContent>
            <Image
              src="/CustomerTypePriceRate.png" // publicディレクトリにある画像へのパス
              alt="My Image" // 画像の説明（アクセシビリティ用）
              width={1000} // 画像の幅（ピクセル単位）
              height={600} // 画像の高さ（ピクセル単位）
            />

            <ul className="list-inside list-disc">
              <li>individual：個人向け販売価格</li>
              <li>corporate：法人向け価格</li>
              <li>wholesale：卸売り業者向け価格</li>
              <li>cost：仕入れ値</li>
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
