const {prisma} = require('./prisma');

async function GithubAuth(profile) {
    const email = profile.emails?.[0]?.value;
    
    const user = await prisma.user.findUnique({ 
        where : {
            email
        }
    });
    
    if (!user) {
        await prisma.user.create({
            data: {
                email,
                username: profile.username || email.split('@')[0],
                githubId: profile.id,
                avatar: profile.photos?.[0]?.value
            }
        });
    } 
    
    if (!user.githubId) {
        await prisma.user.update({
            where : {
                email
            },
            data : {
                githubId: profile.id
            }
        });
    }

    return user;
} 

async function GoogleAuth(profile) {
    const email = profile.emails[0].value

      const user = await prisma.user.findUnique({ 
        where : {
            email
        }
    });
    
    if (!user) {
        await prisma.user.create({
            data: {
                email,
                username: email.split('@')[0],
                googleId: profile.id,
                avatar: profile.photos[0].value
            }
        });
    }  
    
    if (!user.googleId){
        await prisma.user.update({
            where : {
                email
            },
            data : {
                googleId: profile.id
            }
        });
    }

    return user;
}

module.exports = {
    GithubAuth,
    GoogleAuth
}