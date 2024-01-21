import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { json } from "express"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
    const videoFileLocalPath = req.files?.videoFile[0].path;
    const thumbnailLocalPath = req.files?.thumbnail[0].path;
    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    const video = await Video.create({
        title,
        duration: videoFile.duration,
        description,
        thumbnail: thumbnail.url,
        videoFile: videoFile.url,
        owner: req.user._id
    })
    if (!video) {
        throw new ApiError(500, "Couldn't create video")
    }
    return res.status(200).json(new ApiResponse(200, video, "success uploaded successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    return res.status(200).json(new ApiResponse(200, video, "video fetched successfully"))


})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:
            {
                title: req.body.title,
                description: req.body.description
            }
        },
        { new: true }
    )
    if (!video) {
        throw new ApiError(500, "Couldn't update video")
    }
    return res.status(200).json(new ApiResponse(200, video, "video updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const video = await Video.findByIdAndDelete(videoId)
    if (!video) {
        throw new ApiError(500, "Couldn't delete video")
    }
    return res.status(200).json(new ApiResponse(200, video, "video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: publish status
    const video = await getVideoById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    video.publish = !video.publish
    await video.save()
    return res.status(200).json(new ApiResponse(200, video, "video updated successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
