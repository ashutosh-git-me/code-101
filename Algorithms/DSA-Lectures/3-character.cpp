//Program to Find if your input is an UpperCase, LowerCase or Numeric

#include<iostream>
using namespace std;

int main(){
    char c;
    cout<<"Enter a Character: ";
    cin>>c;

    if (c>='a' && c<='z'){
        cout<<endl<<"Your Character is a LowerCase";
    }   else if (c>='A' && c<='Z'){
        cout<<endl<<"Your Character is an UpperCase";
    }   else if (c<='9' && c>='0'){
        cout<<endl<<"Your Character is a Numeric";
    }

}