#include <iostream>
#include <stdlib.h>
using namespace std;
int main()
{

//this while condition will always be true if exit( is not put.)
while(1)
{
  cout<<"HOW YOU DOIN????"<<endl;

  int num=1;
  switch(num)
  {
    case 1: cout<<"I'M FINE"<<endl;
    break;
  }
  exit(0);
}

}

//ANSWER: BY PUTTING EXIT(0) , WE CAN EXIT OUT OF INFINITE LOOP.

/*
2) WHY WE CAN'T USE CONTINUE STATEMENT IN CASE OF SWITCH CASE?

ANS: CONTINUE CAN'T BE USED IN CASE OF SWITCH CASE BECAUSE AS THE CASE CONSTANT MATCHES WITH THE USERS INPUT THE FLOW WILL COME DOWN AND TRY TO EXECUTE BUT BECAUSE OF CONTINUE IT WILL SKIP THAT PART AND ITERATION WILL GO ON AND ON. THAT'S WHY WE USE BREAK , TO STOP  AT THE POINT ONCE WE EXUCUTE OUR PART.
*/
