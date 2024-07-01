"use client";

import Image from "next/image";
import Link from "next/link";
import { Booktype } from "@/app/types/type";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type BookProps = {
  book: Booktype;
  isPurchased: boolean;
};

// eslint-disable-next-line react/display-name
const Book = ({ book, isPurchased }: BookProps, price: number) => {
  const [showModal, setshowModal] = useState(false);
  const { data: session } = useSession();
  const user: any = session?.user;
  const router = useRouter();

  const startCheckout = async () => {
    console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: book.title,
            price: book.price,
            userId: user?.id,
            bookId: book.id,
          }),
        }
      );
      const responseData = await response.json();

      if (responseData) {
        router.push(responseData.checkout_url);
      }
    } catch (err) {
      console.error("Error occurred during startCheckout:", err);
    }
  };

  const handlePurchaseClick = () => {
    if (isPurchased) {
      alert("その商品は購入済みです");
    } else {
      setshowModal(true);
    }
  };

  const handleCancel = () => {
    setshowModal(false);
  };

  const handlePurchaseConfirm = () => {
    if (!user) {
      setshowModal(false);
      //ログインページへリダイレクト
      router.push("/login");
    } else {
      //stripeで決済する
      startCheckout();
    }
  };

  return (
    <>
      {/* アニメーションスタイル */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .image-container img {
          width: 400px; /* 最大幅を設定 */
          height: 300px; /* 最大高さを設定 */
          object-fit: cover;
        }
      `}</style>

      <div className="flex flex-col items-center m-4">
        <a
          onClick={handlePurchaseClick}
          className="cursor-pointer shadow-2xl duration-300 hover:translate-y-1 hover:shadow-none"
        >
          <div className="image-container">
            <Image
              priority
              src={book.thumbnail.url}
              alt={book.title}
              width={400}
              height={300}
              className="rounded-t-md"
            />
          </div>
          <div className="px-4 py-4 bg-slate-100 rounded-b-md">
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="mt-2 text-lg text-slate-600">この本は○○...</p>
            <p className="mt-2 text-md text-slate-700">値段：{book.price}円</p>
          </div>
        </a>
        {showModal && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-slate-900 bg-opacity-50 flex justify-center items-center modal">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-xl mb-4">本を購入しますか？</h3>
              <button
                onClick={handlePurchaseConfirm}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
              >
                購入する
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Book;
