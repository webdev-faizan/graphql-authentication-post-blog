"use client";
import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { format } from "date-fns";
import { getCookie } from "cookies-next";
import Link from "next/link";
import Avatar from "react-avatar";

import { IoIosSend } from "react-icons/io";
import { TfiCommentsSmiley } from "react-icons/tfi";
import Comments from "../../Components/Comments";
import LikeButtton from "../../Components/LikeButtton";
import { GET_SHARE_POST } from "../../graphql/query/post";
import ShareSocailMedial from "../../Components/ShareSocailMedial";
import CardSkeletonLoader from "../../Components/loader/CardSkeletonLoader";
import ProtectRoutes from "../../Components/ProtectRoutes";
const user_id = getCookie("user_id");

const page = ({ params }) => {
  const [showShare, setShowShare] = useState(false);
  const [postId, setPostId] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [foundPost, setFoundpost] = useState(false);
  const { loading, data } = useQuery(GET_SHARE_POST, {
    variables: {
      id: params.id[0].toString(),
    },
    fetchPolicy: "cache-and-network",
    onError: ({ graphQLErrors }) => {
      if (graphQLErrors[0].status == 404) {
        setFoundpost(true);
      }
    },
    onCompleted: () => {
      setFoundpost(false);
    },
  });
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  if (foundPost) {
    return (
      <>
        <div className="h-screen  text-5xl font-semibold text-center justify-center flex items-center w-screen sm:text-6xl">
          No posts found. 😇😇
        </div>
      </>
    );
  }
  return (
    <ProtectRoutes>
      <Comments
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        postId={postId}
      />

      <div className="p-3 mt-[70px] md:mt-12 md:p-10">
        <div className="flex  justify-center">
          {loading && [1].map((_, index) => <CardSkeletonLoader key={index} />)}
        </div>
        <div className="flex  justify-center ">
          {data?.getSharePost.data.map((data) => {
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
            const { firstName, lastName, id: userid, profile } = postOwner;
            const isLikeUser =
              user_id &&
              Boolean(
                likes &&
                  likes.find(
                    (alluserid) => alluserid.toString() == user_id.toString()
                  )
              );

            return (
              <div
                className="w-full sm:w-[500px] relative  hover:shadow-xl hover:shadow-slate-500 bg-white  rounded-lg shadow h-fit border border-[#e6ebf3]"
                key={id}
              >
                <Link
                  href={`/profile/user/${userid}`}
                  className="cursor-pointer "
                >
                  <div className="flex items-center p-2 ">
                    <div className="flex-shrink-0">
                      <Avatar
                        style={{
                          border: "2px solid gray",
                        }}
                        src={`${profile}`}
                        name={`${firstName ? firstName + " " : ""}${
                          lastName ? lastName : ""
                        }`}
                        size={40}
                        round={true}
                      />
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-xl font-medium tex-[gb(10, 11, 14)] capitalize">
                        {firstName} {lastName}
                      </p>

                      <p className="text-sm text-gray-500 truncate dark:text-gray-400 mt-[2px]">
                        {postCreatedAt}
                      </p>
                    </div>
                  </div>
                  <hr className="" />
                </Link>
                <Link
                  href={`/post/${id}`}
                  className="cursor-pointer w-full block bg-white"
                  target="_blank"
                >
                  <img
                    className="rounded-t-lg h-[250px]"
                    src={attachment}
                    alt
                  />
                </Link>
                <div className="pb-2">
                  <div className="p-3 ">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-[#202124]">
                      {title}
                    </h5>
                    <p className="mb-3 font-normal text-[#202124] max-h-[50px] overflow-hidden">
                      {description}
                    </p>
                  </div>
                  <div className="flex  justify-between cursor-pointer border-y py-2  px-5  ">
                    <div className="flex gap-1">
                      <LikeButtton
                        postId={id}
                        isLikeUser={isLikeUser}
                        likeCount={likeCount}
                      />
                    </div>
                    <div className="flex gap-1">
                      <TfiCommentsSmiley
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
                        <IoIosSend size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ProtectRoutes>
  );
};

export default page;
