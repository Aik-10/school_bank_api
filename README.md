## This is WIP 

## Auth
- [POST] http://localhost:3000/auth/login 
- [POST] http://localhost:3000/auth/register
- [GET, POST] http://localhost:3000/auth/test

- [GET] http://localhost:3000/auth/cards
  - Send card information to backend and thats validate, is valid card or not.
  
- [POST] http://localhost:3000/auth/cards/validate
  - SEND {card_id & pinCode} to validate, and thats return auth token with include 
    - TOKEN includes
      - user_id
      - card_id
      - expiration

## User things
- [GET] http://localhost:3000/user
  - Give person information
  
- [GET] http://localhost:3000/user/accounts
  - List of user accounts

- [GET] http://localhost:3000/user/cards
  - Return cards

- [POST] http://localhost:3000/user/accounts/$id/action/$action{deposit / withdrawal / transfer}/?amount=&target=

- [GET] http://localhost:3000/user/accounts/$id/transactions?limit=&offset=


