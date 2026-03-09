//summation

#include<iostream>
using namespace std;

int main()
{
    int n;
    cout<<"Enter a number: ";
    cin>>n;
    int i=1;
    int sum=0;

    while (i<=n)
    {
        sum+=i;
        i+=1;
    }

    cout<<endl<<"The sum is: "<<sum;
}