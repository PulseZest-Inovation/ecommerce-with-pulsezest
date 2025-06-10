import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

const FirebaseAdmin = {
    FirebaseProjectId : 'ecommerce-with-pulsezest',
    FirebaseClientEmail: 'firebase-adminsdk-z5pvn@ecommerce-with-pulsezest.iam.gserviceaccount.com',
    FirebasePrivateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDhKeY9TLZyroGJ\nA6+bm2S8BgYG2w4JDk55mTPFtfjcsil+Ec4x7Lh07rpmGxBaAYBay9FBf4cNKXxO\nNtmMSMob8f2F3lrn3QMFiek7QBq+MduvQahg1ovqeAuer+fF4kQ6at4GxE5+JXuW\nkkj56Tdzv1GW4RZIdBUtTCfWyT4269s+UhpGtM+VFfWtgsX4vBw7MQVnuzyp+97I\nZiGddyqz+YX1D9dDzY25R8yDbFH6kXuqSM7RMth8KNmgosLhS/w90urtB1wS1FQQ\n4ForYSKkLe6iaiTBVKRXN5uZpeUW+ArvI45wGs7hNnGETfHj/7RUWPa5lkDpWXW4\n3VwxDPJRAgMBAAECggEAAqy3PfIr1qfpBQIks2IAq9UcfDdc7tGbMAmYWlhjiOea\n45L9ko0/0a/GShE3PAJ5jlqOdUs5BPiBsAIpymdQ800IGG+AP/HZp9awDRKhXrID\n7IyIngHebp4XcT6gr7KU4ebEFWt+jTQPyEWblVBmZrsWkobA94JdgAjADmaclRVp\ndC5pHca4u/B4CqqMJegCBAGMzETA0adPvPzr22LTcpA+apyDqf2WY3nUz5Sha3uH\nGxw8GpXorMKqUDC+qOQiU8VvjpNUmobv1RZ13CDLF5QGXjWOFKsryydvo0iOuNQU\nQvChip3T8gZVvf0PpB2B2BUZfXxO8c7smL4YPJUGuwKBgQD12l+I7WR9QaatEiMl\n7D++uCLT4ACwxOp+g7MoRPs8hy/XZE9ReSN6cUT5JP482VkMf7vAL1tibtZLIrTR\nn6nlW71gGypXV1Rl1J/cxWcB9zRKrIgn1jbbVa4tL7lq2RjuY2C2Qp3kCgJTXHsm\ncbWdCo6RUMlbjkRMYxzbVzlgPwKBgQDqdO1fd/LtphIQfuZYYJ3usGnW1KjsxKJt\n0Q9tpy43DH+zN37UN8F2Z6vrEvsnV9MfisnSWX5Csp2r+GcA/vJrGL/FrZBXJy5C\nvQ9YihlLd4AnFvTM/8AUM/AY2AUjd1GuiyOHXd655G3nyn+OY5t92yfDGZ3lJytj\nphb+krYJbwKBgQDpcJRN27sTBAdTRmmBVLWiTg0jyQpezlsqDbtLfVRgwKw4hNKb\ntb5uQKcROoL9HBNlvtNzRIQtDrkDVs0CTexwD4/ddW3ayN0mY6H3aqjIQQWx8ejG\niqxDzzM3TJ1uSv1VPZ9S8CYjpS1YIfP9KPMdTizY5jCLcqZ/MYzw5/1e2QKBgH2E\n5+gqgWX1eMpYBd3eq+6zh5Y59836X7NHL2lXDYjvKha6aS4YQ3yud/28BbXEcQT7\n+pygyNXQZlVBAXQpCYOIlnKwPwxJr5yPNv4BwRUD/xnuUlTFvwGR5MKINAgOwy4c\n04KPIMSIpMZpROzoKsCwaZMrzbp2w+Xvb3QO+2IFAoGBAN6ucrDelr65hXCr34F9\nygi3FqbpAuy/7mBAqn0Gb3/RU844M6LfPeXdLnP3Cch71CGMxW1Sgjnp0A/F1c4/\nVYGgGZv+oOa6sFjWjSOknZsZJswIyQTMMqIQUYj3FbcGurk8hK0gJ7I4ZxnXpJn0\n55oSw21eh+jc76HirINou08o\n-----END PRIVATE KEY-----\n',
}


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FirebaseAdmin.FirebaseProjectId,
      clientEmail: FirebaseAdmin.FirebaseClientEmail,
      privateKey: FirebaseAdmin.FirebasePrivateKey?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();
const adminAuth = admin.auth();
export { db, adminAuth };
