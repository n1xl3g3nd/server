        // index.js(server/routes)
        import express from 'express'
        import user from './user.js'
        import news from './news.js'
        import type from './type.js'
        import rating from './rating.js'
        import friends from './friends.js'
        import dialog from './dialog.js'
        import messages from './messages.js'
        const router = new express.Router()

        router.use('/news', news)
        router.use('/type', type)
        router.use('/user', user)
        router.use('/friends', friends)
        router.use('/rating',rating)
        router.use('/dialog',dialog)
        router.use('/messages',messages)

        export default router