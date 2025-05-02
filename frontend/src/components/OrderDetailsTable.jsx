import React, { useRef, useEffect, useState } from 'react';
import InputFieldArrow from './InputFieldArrow';
import CommentModal from './CommentModal';

const OrderDetailsTable = ({ data, register, errors, onCommentsChange }) => {
    const inputRefs = useRef([]);
    const [activeCommentItem, setActiveCommentItem] = useState(null);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [comments, setComments] = useState(() => {
        const initialComments = {};
        if (data.last_prices) {
            data.last_prices.forEach((item) => {
                if (item.price?.comment) {
                    initialComments[item.price.order_item.id] =
                        item.price.comment;
                }
            });
        }
        return initialComments;
    });

    useEffect(() => {
        onCommentsChange(comments);
    }, [comments, onCommentsChange]);

    const handleKeyDown = (event, index) => {
        if (event.key === 'ArrowDown' && index < data.last_prices.length - 1) {
            inputRefs.current[index + 1]?.focus();
        } else if (event.key === 'ArrowUp' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleAddComment = (item) => {
        const itemId = item.id || item.price?.order_item?.id;
        setActiveCommentItem({
            ...item,
            id: itemId,
            currentComment: comments[itemId] || '',
            name: item.name || item.price?.order_item?.item?.name,
        });
        setShowCommentModal(true);
    };

    const handleSaveComment = (comment) => {
        if (activeCommentItem) {
            setComments((prev) => ({
                ...prev,
                [activeCommentItem.id]: comment,
            }));
        }
        setShowCommentModal(false);
    };

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const renderTableRow = (item, index, isEditable = false) => {
        const itemId = item.price?.order_item?.id || index;
        const hasComment = !!comments[itemId];

        return (
            <tr key={index} className="animate-fade-in">
                <td className="border p-2 text-gray-200 max-w-[512px]">
                    {item.name || item.price?.order_item?.item?.name}
                </td>
                <td className="border p-2 text-gray-200">
                    {item.amount || item.price?.order_item?.amount}
                </td>
                <td className="border p-2 text-gray-800 max-w-[150px]">
                    {isEditable ? (
                        <InputFieldArrow
                            id={`price-${itemId}`}
                            type="numeric"
                            register={register}
                            errors={errors}
                            validation={{
                                min: {
                                    value: 0,
                                    message: 'Price can not be less than zero',
                                },
                                max: {
                                    value: 100000,
                                    message:
                                        'Price can not be more than 100000',
                                },
                            }}
                            labelClassName="text-gray-800"
                            defaultValue={
                                item.price?.price
                                    ? parseFloat(item.price?.price)
                                    : null
                            }
                            onKeyDown={(event) => handleKeyDown(event, index)}
                            ref={(el) => (inputRefs.current[index] = el)}
                        />
                    ) : (
                        item.price
                    )}
                </td>
                <td className="border p-2 text-center">
                    <button
                        type="button"
                        onClick={() =>
                            handleAddComment({ ...item, id: itemId })
                        }
                        className={`px-2 py- text-white text-sm rounded-md font-medium ${
                            hasComment
                                ? 'bg-teal-600 hover:bg-teal-700 hover:shadow-[0_0_6px_rgba(13,148,136,0.6)] hover:scale-101'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-[0_0_6px_rgba(99,102,241,0.6)] hover:scale-101'
                        } focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#39393A] ${
                            hasComment
                                ? 'focus:ring-teal-400'
                                : 'focus:ring-indigo-400'
                        } transition-all duration-200`}
                        aria-label={
                            hasComment
                                ? 'Edit comment for item'
                                : 'Add comment for item'
                        }
                    >
                        {hasComment ? 'Edit comment' : 'Add comment'}
                    </button>
                </td>
            </tr>
        );
    };

    switch (data.status.code) {
        case 100:
        case 101:
        case 103:
            return (
                <div className="animate-slide-in">
                    <h3 className="text-xl font-medium text-[#FFFFFF] mb-4">
                        Products from the order
                    </h3>
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border p-2 text-gray-200">
                                    Product
                                </th>
                                <th className="border p-2 text-gray-200">
                                    Amount
                                </th>
                                <th className="border p-2 text-gray-200">
                                    Price
                                </th>
                                <th className="border p-2 text-gray-200 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.last_prices.map((last_price, index) =>
                                renderTableRow(last_price, index, true)
                            )}
                        </tbody>
                    </table>
                    {showCommentModal && (
                        <CommentModal
                            isOpen={showCommentModal}
                            onClose={() => setShowCommentModal(false)}
                            item={activeCommentItem}
                            onSubmit={handleSaveComment}
                        />
                    )}
                </div>
            );
        case 102:
            return (
                <div className="animate-slide-in">
                    <h3 className="text-xl font-medium text-[#FFFFFF] mb-4">
                        Products from the order
                    </h3>
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border p-2 text-gray-200">
                                    Product
                                </th>
                                <th className="border p-2 text-gray-200">
                                    Amount
                                </th>
                                <th className="border p-2 text-gray-200">
                                    Price
                                </th>
                                <th className="border p-2 text-gray-200 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.map((item, index) =>
                                renderTableRow(item, index)
                            )}
                        </tbody>
                    </table>
                    {showCommentModal && (
                        <CommentModal
                            isOpen={showCommentModal}
                            onClose={() => setShowCommentModal(false)}
                            item={activeCommentItem}
                            onSubmit={handleSaveComment}
                        />
                    )}
                </div>
            );
        default:
            return <></>;
    }
};

export default OrderDetailsTable;
