import { Notification } from "../models/notification.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError}from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
export const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ to: req.user._id })
        .populate("from", "username ProfilePic")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, notifications, "Notifications fetched"));
});

// To clear notifications
export const deleteNotifications = asyncHandler(async (req, res) => {
    await Notification.deleteMany({ to: req.user._id });
    return res.status(200).json(new ApiResponse(200, {}, "Notifications cleared"));
});