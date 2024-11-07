export const Samplechats = [
    {
        avatar: ["https://www.w3sch00ls.com/howto/img_avatar.png"],
        name: "John Doe",
        _id: "1",
        groupChat: false,
        members: ["1", "2"]
    },

    {
        avatar: ["https://www.w3sch00ls.com/howto/img_avatar.png"],
        name: "ace Doe",
        _id: "2",
        groupChat: false,
        members: ["1", "2"]
    },
]

export const SampleUSers = [
    {
        avatar: ["https://www.w3sch00ls.com/howto/img_avatar.png"],
        name: "John Doe",
        _id: "1",
    },
    {
        avatar: ["https://www.w3sch00ls.com/howto/img_avatar.png"],
        name: "John wik",
        _id: "2",
    },

]

export const SampleNotification = [
    {
        sender: {
            avatar: ["https://www.w3sch00ls.com/howto/img_avatar.png"],
            name: "John Doe",
        },
        _id: "1",
    },
    {
        sender: {
            avatar: ["https://www.w3sch00ls.com/howto/img_avatar.png"],
            name: "Alen wick",
        },
        _id: "2",
    },
]

export const sampleMessage = [
    {
        attachment: [
            {
                public_id: "abcd",
                url: "/image/3d-portrait-people.jpg",
            },
        ],
        content: " Lorem ipsum dolor sit amet, consectetur adip",
        _id: "hdsdvhjcdshbvhjbbjhbf",
        sender: {
            _id: "user._id",
            name: "Chaman",
        },
        chat: "chatId",
        createdAt: '2024-05-01T00:00:00.000Z'
    },
    {
        attachments: [
            {
                public_id: "abc3d",
                url: "/image/3d-portrait-people.jpg",
            },
        ],
        content: " Lorem ipsum dolor sit amet, consectetur adip",
        _id: "hdsdvhjcdsbjhbf",
        sender: {
            _id: "hghghgfhd",
            name: "Chaman 4",
        },
        chat: "chatId",
        createdAt: '2024-05-01T00:00:00.000Z'
    },
];

export const dashboardData = {
    users: [
        {
            name: "Alex",
            avatar: "https://www.w3sch00ls.com/howto/img_avatar.png",
            _id: "1",
            username: "alex_fil",
            friends: 20,
            groups: 3,
        },
        {
            name: "John",
            avatar: "https://www.w3sch00ls.com/howto/img_avatar.png",
            _id: "2",
            username: "john_ady",
            friends: 20,
            groups: 2,
        },
    ],

    chats: [{
        name: "holiday group",
        avatar: ["https://www.w3sch00ls.com/howto/img_avatar.png"],
        _id: "1",
        groupChat: false,
        members: [{_id:"1", avatar:"https://www.w3sch00ls.com/howto/img_avatar.png"},{_id:"2", avatar:"https://www.w3sch00ls.com/howto/img_avatar.png"},{_id:"3", avatar:"https://www.w3sch00ls.com/howto/img_avatar.png"}],
        totalMembers:2,
        totalMessages: 20,
        creator:{
            name: "John",
            avatar: "https://www.w3sch00ls.com/howto/img_avatar.png",
        },
    },
    {
        name: "trip group",
        avatar: ["https://www.w3sch00ls.com/howto/img_avatar.png"],
        _id: "2",
        groupChat: true,
        members: [{_id:"1", avatar:"https://www.w3sch00ls.com/howto/img_avatar.png"},{_id:"2", avatar:"https://www.w3sch00ls.com/howto/img_avatar.png"}],
        totalMembers:2,
        totalMessages: 20,
        creator:{
            name: "howay",
            avatar: "https://www.w3sch00ls.com/howto/img_avatar.png",
        },
    },
    ],

    messages:[
        {
            attachments:[],
            content: "ha ha ha",
            _id:"jbhchd",
            sender:{
                avatar:"https://www.w3sch00ls.com/howto/img_avatar.png",
                name:"Channu",
            },
            chat:"chatId",
            groupChat:false,
            createdAt: "2024-05-01T00:00:00.000Z"
        },
        {
            attachments:[{
                public_id:"ashjbc",
                url:"https://www.w3sch00ls.com/howto/img_avatar.png",
            }],
            content: "yooo",
            _id:"jbhnkvfnchd",
            sender:{
                avatar:"https://www.w3sch00ls.com/howto/img_avatar.png",
                name:"Channu",
            },
            chat:"chattId",
            groupChat:true,
            createdAt: "2024-05-01T00:00:00.000Z"
        }
    ]
}