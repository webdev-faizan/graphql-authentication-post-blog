"use client";
import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@apollo/client";
import { FaRegComment } from "react-icons/fa6";
import { FaShare } from "react-icons/fa";
import { getCookie } from "cookies-next";
import Link from "next/link";
const user_id = getCookie("user_id");
import LikeButtton from "./LikeButtton";
import Comments from "./Comments";
import ShareSocailMedial from "./ShareSocailMedial";
import CardSkeletonLoader from "../Components/loader/CardSkeletonLoader";
const Cards = ({ query }) => {
  const [postId, setPostId] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [showShare, setShowShare] = useState(false);
  const { loading, data, fetchMore } = useQuery(query, {
    variables: {
      page: 1,
      limit: 10,
      
    },
    fetchPolicy: "cache-and-network",
  });
  const handleScroll = () => {
    if (
      window.pageYOffset + window.innerHeight >=
      document.documentElement.scrollHeight
    ) {
      setPage(page + 1);
      fetchMore({
        variables: {
          limit: 10,
          page: page,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          return {
            ...prev,
            ...fetchMoreResult,
          };
        },
      });
    }
  };
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [data, fetchMore]);
  useEffect(() => {
    if (modalIsOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [modalIsOpen]);

  const POST = data?.getAllPost?.data || data?.getUserPost?.data;

  return (
    <div>
      <Comments
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        postId={postId}
      />
      <div className="p-3 mt-[70px] md:mt-12 md:p-10">
        <div className="flex gap-2 flex-wrap justify-center">
          {loading &&
            [1, 2, 3, 4, 5, 6, 7, 8, ].map((_, index) => (
              <CardSkeletonLoader key={index} />
            ))}
        </div>
        <div className="flex gap-10  justify-center md:justify-start flex-wrap ">
          <div className="flex  flex-wrap justify-between gap-6">
            {POST?.map((data) => {
              const {
                createdAt,
                id,
                title,
                description,
                attachment,
                commentCount,
                likeCount,
                postOwner,
                likes,
              } = data;
              const date = new Date(createdAt);
              const postCreatedAt = format(date, "d MMM yyyy");
              const { firstName, lastName, id: userid } = postOwner;
              const isLikeUser =
                user_id &&
                Boolean(
                  likes &&
                    likes.find(
                      (alluserid) => alluserid.toString() == user_id.toString()
                    )
                );

              return (
                <div className="max-w-sm relative  bg-[#125597] border-gray-200 rounded-lg shadow h-fit">
                  <Link
                    href={`/profile/user/${userid}`}
                    className="cursor-pointer "
                  >
                    <div className="flex items-center p-2 ">
                      <div className="flex-shrink-0">
                        <img
                          className="w-9 h-9 rounded-full object-center"
                          src="/image-1.jpg"
                          alt="Neil image"
                        />
                      </div>
                      <div className="flex-1 min-w-0 ms-4">
                        <p className="text-xl font-medium dark:text-white capitalize">
                          {firstName} {lastName}
                        </p>

                        <p className="text-sm text-gray-500 truncate dark:text-gray-400 mt-[2px]">
                          {postCreatedAt}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href={`/post/${id}`}
                    className="cursor-pointer w-full block bg-white"
                    target="_blank"
                  >
                    <img
                      className="rounded-t-lg h-[250px]"
                      src="image-1.jpg"
                      alt
                    />
                  </Link>
                  <div className="p-5 ">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
                      {title}
                    </h5>
                    <p className="mb-3 font-normal text-white ">
                      {description}
                    </p>
                    <div className="flex  justify-between cursor-pointer ">
                      <div className="flex gap-1">
                        <LikeButtton
                          postId={id}
                          isLikeUser={isLikeUser}
                          likeCount={likeCount}
                        />
                      </div>
                      <div className="flex gap-1">
                        <FaRegComment
                          size={20}
                          onClick={() => {
                            openModal();
                            setPostId(id);
                          }}
                        />
                        {commentCount}{" "}
                      </div>
                      <div className="flex gap-1 ">
                        <ShareSocailMedial
                          showShare={showShare}
                          url={`/post/${id}`}
                          setShowShare={setShowShare}
                        />
                        <button onClick={() => setShowShare(!showShare)}>
                          <FaShare size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
