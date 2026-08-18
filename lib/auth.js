const {prisma} = require('./prisma');

async function GithubAuth(profile, accessToken) {
console.log('🔑 ACCESS TOKEN:', accessToken); 

    let email = profile._json.email 

    if (!email && accessToken) {
        const response = await fetch('https://api.github.com/user/emails', {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Accept": "application/json",
                "User-Agent": "Recre8"
            }
        })
        
        const emails = await response.json();

        email = emails.find((email) => email.primary === true).email
    }
    
    let user = await prisma.user.findUnique({ 
        where : {
            email
        }
    });
    
    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                username: profile.username || email.split('@')[0],
                githubId: profile.id,
                avatar: profile.photos?.[0]?.value
            }
        });
    } 
    
    if (!user.githubId) {
        user = await prisma.user.update({
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

    console.log( JSON.stringify(profile, null, 2));
    const email = profile.emails[0].value

    let user = await prisma.user.findUnique({ 
        where : {
            email
        }
    });
    
    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                username: email.split('@')[0],
                googleId: profile.id,
                avatar: profile.photos[0].value
            }
        });
    }  
    
    if (!user.googleId){
        user = await prisma.user.update({
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