import * as bcrypt from 'bcrypt';
import * as Multer from 'multer';

const storageOptions =
    Multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './src/uploads');
          },
          filename: function (req, file, cb) {
            cb(null, file.originalname);
          }
    });

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
};


export class Utils {
    public MAX_TOKEN_TIME = 60000;
    public multer = Multer({storage : storageOptions,fileFilter:fileFilter});

    //Function to generate verification token for email verification
    static generateVerificationToken(size:number = 5) // Size tells the size of the verification token
    {
        let digits = '0123456789';
        let otp = '';
        for(let i = 0; i<size; i++){
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return parseInt(otp);
    }


    //Function to hash password
    static encryptPassword (password:string) : Promise <any> {
        return new Promise((resolve,reject)=>{
            bcrypt.hash(password,10,(err,hash)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(hash);
                }
            })
        })
    }

    //Function to compare bcypt compare password
    static async comparePassword(password :{plainPassword:string, encryptedPassword:string }) : Promise <any> {
        return new Promise((resolve,reject)=>{
            bcrypt.compare(password.plainPassword, password.encryptedPassword,(err , isSame)=>{
                if(err){ //If there is an error
                    reject(err);
                }else if(!isSame) {  //If the passwords are not same
                    reject(new Error('User and password does not match'))
                }else { //No error and the password is same and correct
                    resolve(true);
                }
            })
        })
    }
}